package com.example.koboard.ui.Kotemps;

import android.Manifest;
import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;

import androidx.lifecycle.ViewModel;

import com.example.koboard.model.ScheduledEvents;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.api.client.extensions.android.http.AndroidHttp;
import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential;
import com.google.api.client.googleapis.extensions.android.gms.auth.GooglePlayServicesAvailabilityIOException;
import com.google.api.client.googleapis.extensions.android.gms.auth.UserRecoverableAuthIOException;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.ExponentialBackOff;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.EventReminder;
import com.google.api.services.calendar.model.Events;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import pub.devrel.easypermissions.AfterPermissionGranted;
import pub.devrel.easypermissions.EasyPermissions;

public class KotempsViewModel extends ViewModel {

    public static GoogleAccountCredential mCredential;
    public static final int REQUEST_ACCOUNT_PICKER = 1000;
    public static final int REQUEST_AUTHORIZATION = 1001;
    public static final int REQUEST_GOOGLE_PLAY_SERVICES = 1002;
    public static final int REQUEST_PERMISSION_GET_ACCOUNTS = 1003;
    public static final String PREF_ACCOUNT_NAME = null;//si ça marche pas, essayer ça "adrien.verdier@gmail.com";
    private static final String[] SCOPES = { CalendarScopes.CALENDAR_READONLY, CalendarScopes.CALENDAR };
    private Context context;
    private Activity activity;
    private KotempsFragment fragment;

    private ScheduledEvents currentEvent;
    private ArrayList<ScheduledEvents> EventsList = new ArrayList<ScheduledEvents>();

    public KotempsViewModel(KotempsFragment fragment, Context context, Activity activity) {
        currentEvent = new ScheduledEvents("Event Name", "Description", "Participant", "Location", "Hour-Minute", "Year-Month-Day-Hour-Minute");

        this.context = context;
        this.activity = activity;
        this.fragment = fragment;

        mCredential = GoogleAccountCredential.usingOAuth2(
                context, Arrays.asList(SCOPES))
                .setBackOff(new ExponentialBackOff());
        getResultsFromApi();
    }

    public ScheduledEvents getCurrentEvent() {
        return currentEvent;
    }

    public void setCurrentEvent(ScheduledEvents event) {
        currentEvent = event;
    }

    public void getResultsFromApi() {
        if (! isGooglePlayServicesAvailable()) {
            acquireGooglePlayServices();
        } else if (mCredential.getSelectedAccountName() == null) {
            chooseAccount();
        } else if (! isDeviceOnline()) {
            // Mettre une notification sur l'écran comme dans l'appli d'avant
            System.out.println("No network connection available.");
        } else {
            new MakeRequestTask(mCredential).execute();
        }
    }

    @AfterPermissionGranted(REQUEST_PERMISSION_GET_ACCOUNTS)
    private void chooseAccount() {
        if (EasyPermissions.hasPermissions(
                context, Manifest.permission.GET_ACCOUNTS)) {
            String accountName = activity.getPreferences(Context.MODE_PRIVATE)
                    .getString(PREF_ACCOUNT_NAME, null);
            if (accountName != null) {
                mCredential.setSelectedAccountName(accountName);
                getResultsFromApi();
            } else {
                // Start a dialog from which the user can choose an account
                fragment.chooseAccount(mCredential, REQUEST_ACCOUNT_PICKER);
            }
        } else {
            // Request the GET_ACCOUNTS permission via a user dialog
            fragment.requestPermission("This app needs to access your Google account (via Contacts).",
                    REQUEST_PERMISSION_GET_ACCOUNTS);
        }
    }

    private boolean isDeviceOnline() {
        ConnectivityManager connMgr =
                (ConnectivityManager) activity.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
        return (networkInfo != null && networkInfo.isConnected());
    }

    private boolean isGooglePlayServicesAvailable() {
        GoogleApiAvailability apiAvailability =
                GoogleApiAvailability.getInstance();
        final int connectionStatusCode =
                apiAvailability.isGooglePlayServicesAvailable(context);
        return connectionStatusCode == ConnectionResult.SUCCESS;
    }

    private void acquireGooglePlayServices() {
        GoogleApiAvailability apiAvailability =
                GoogleApiAvailability.getInstance();
        final int connectionStatusCode =
                apiAvailability.isGooglePlayServicesAvailable(context);
        if (apiAvailability.isUserResolvableError(connectionStatusCode)) {
            showGooglePlayServicesAvailabilityErrorDialog(connectionStatusCode);
        }
    }

    void showGooglePlayServicesAvailabilityErrorDialog(
            final int connectionStatusCode) {
        GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
        Dialog dialog = apiAvailability.getErrorDialog(
                activity,
                connectionStatusCode,
                REQUEST_GOOGLE_PLAY_SERVICES);
        dialog.show();
    }

    //Provisoire Pour que ça marche
    public void createEvent(ScheduledEvents event){
        EventAttendee eventAttendeeEmail[] = new EventAttendee[10];
        if(event.getAttendees().equalsIgnoreCase("")) {
            eventAttendeeEmail = new EventAttendee[10];
            String email[] = event.getAttendees().trim().split(",");
            int i = 0;
            for (String s : email) {
                EventAttendee eventAttendee = new EventAttendee();
                eventAttendee.setEmail(s);
                eventAttendeeEmail[i] = eventAttendee;
                i++;
            }
        }

        createEventAsync(event.getEventSummery(), event.getLocation(), event.getDescription(), getDate(event.getStartDate()), getDate(event.getEndDate()), eventAttendeeEmail);
        EventsList.add(event);
    }

    public ArrayList<ScheduledEvents> getEventsList(){
        getResultsFromApi();
        return EventsList;
    }

    private com.google.api.services.calendar.Calendar mService = null;
    private class MakeRequestTask extends AsyncTask<Void, Void, Void> {

        private Exception mLastError = null;
        private boolean FLAG = false;

        public MakeRequestTask(GoogleAccountCredential credential) {
            HttpTransport transport = AndroidHttp.newCompatibleTransport();
            JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();
            mService = new com.google.api.services.calendar.Calendar.Builder(
                    transport, jsonFactory, credential)
                    .setApplicationName("Koboard")
                    .build();
        }

        @Override
        protected Void doInBackground(Void... params) {
            try {
                getDataFromApi();
            } catch (Exception e) {
                e.printStackTrace();
                mLastError = e;
                cancel(true);
            }
            return null;
        }

        private void getDataFromApi() throws IOException {
            // List the next 10 events from the primary calendar.
            DateTime now = new DateTime(System.currentTimeMillis());
            Events events = mService.events().list("primary")
                    .setTimeMin(now)
                    .setOrderBy("startTime")
                    .setSingleEvents(true)
                    .execute();
            List<Event> items = events.getItems();
            ScheduledEvents scheduledEvents;
            EventsList.clear();
            for (Event event : items) {
                DateTime start = event.getStart().getDateTime();
                if (start == null) {
                    start = event.getStart().getDate();
                }
                DateTime end = event.getEnd().getDateTime();
                if (end == null) {
                    end = event.getStart().getDate();
                }
                scheduledEvents = new ScheduledEvents();
                scheduledEvents.setEventId(event.getId());
                scheduledEvents.setDescription(event.getDescription());
                scheduledEvents.setEventSummery(event.getSummary());
                scheduledEvents.setLocation(event.getLocation());
                scheduledEvents.setStartDate(dateTimeToString(start));
                scheduledEvents.setEndDate(dateTimeToString(end));
                StringBuffer stringBuffer = new StringBuffer();
                if(event.getAttendees()!=null) {
                    for (EventAttendee eventAttendee : event.getAttendees()) {
                        if(eventAttendee.getEmail()!=null)
                            stringBuffer.append(eventAttendee.getEmail() + "       ");
                    }
                    scheduledEvents.setAttendees(stringBuffer.toString());
                }
                else{
                    scheduledEvents.setAttendees("");
                }
                EventsList.add(scheduledEvents);
            }
        }

        @Override
        protected void onCancelled() {
            if (mLastError != null) {
                if (mLastError instanceof GooglePlayServicesAvailabilityIOException) {
                    showGooglePlayServicesAvailabilityErrorDialog(
                            ((GooglePlayServicesAvailabilityIOException) mLastError)
                                    .getConnectionStatusCode());
                } else if (mLastError instanceof UserRecoverableAuthIOException) {
                    fragment.error(((UserRecoverableAuthIOException) mLastError).getIntent(),
                            REQUEST_AUTHORIZATION);
                } else {
                    //Ajouter une notification
                    System.out.println("The following error occurred:\n"
                            + mLastError.getMessage());
                }
            } else {
                //Ajouter une notification
                System.out.println("Request cancelled.");
            }
        }
    }

    public void createEventAsync(final String summary, final String location, final String des, final DateTime startDate, final DateTime endDate, final EventAttendee[]
            eventAttendees) {

        new AsyncTask<Void, Void, String>() {
            private com.google.api.services.calendar.Calendar mService = null;
            private Exception mLastError = null;
            private boolean FLAG = false;


            @Override
            protected String doInBackground (Void...voids){
                try {
                    insertEvent(summary, location, des, startDate, endDate, eventAttendees);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return null;
            }

            @Override
            protected void onPostExecute (String s){
                super.onPostExecute(s);
                getResultsFromApi();
            }
        }.execute();
    }
    void insertEvent(String summary, String location, String des, DateTime startDate, DateTime endDate, EventAttendee[] eventAttendees) throws IOException {
        Event event = new Event()
                .setSummary(summary)
                .setLocation(location)
                .setDescription(des);

        EventDateTime start = new EventDateTime()
                .setDateTime(startDate)
                .setTimeZone("Europe/Paris");
        event.setStart(start);

        EventDateTime end = new EventDateTime()
                .setDateTime(endDate)
                .setTimeZone("Europe/Paris");
        event.setEnd(end);

        String[] recurrence = new String[] {"RRULE:FREQ=DAILY;COUNT=1"};
        event.setRecurrence(Arrays.asList(recurrence));


        event.setAttendees(Arrays.asList(eventAttendees));

        EventReminder[] reminderOverrides = new EventReminder[] {
                new EventReminder().setMethod("email").setMinutes(24 * 60),
                new EventReminder().setMethod("popup").setMinutes(10),
        };
        Event.Reminders reminders = new Event.Reminders()
                .setUseDefault(false)
                .setOverrides(Arrays.asList(reminderOverrides));
        event.setReminders(reminders);

        String calendarId = "primary";
        //event.send
        if(mService!=null)
            mService.events().insert(calendarId, event).setSendNotifications(true).execute();
    }

    public DateTime getDate (String date){
        DateTime retour = new DateTime("" + date.substring(0,4) + "-" + date.substring(4,6) + "-" + date.substring(6,8) + "T" + date.substring(8,10) + ":" + date.substring(10,12) + ":00.000Z");
        return retour;
    }

    public String dateTimeToString (DateTime date){
        String str = date.toString();
        return str.substring(0,4) + str.substring(5,7) + str.substring(8,10) + str.substring(11,13) + str.substring(14,16);
    }

}