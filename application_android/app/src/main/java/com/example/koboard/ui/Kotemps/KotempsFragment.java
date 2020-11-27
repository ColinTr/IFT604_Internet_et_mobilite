package com.example.koboard.ui.Kotemps;

import android.Manifest;
import android.accounts.AccountManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import com.example.koboard.R;
import com.example.koboard.model.ScheduledEvents;

import com.github.sundeepk.compactcalendarview.CompactCalendarView;
import com.github.sundeepk.compactcalendarview.domain.Event;
import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential;
import com.google.api.client.googleapis.extensions.android.gms.auth.UserRecoverableAuthIOException;
import com.google.api.client.util.DateTime;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import pub.devrel.easypermissions.AfterPermissionGranted;
import pub.devrel.easypermissions.EasyPermissions;

import static com.example.koboard.ui.Kotemps.KotempsViewModel.REQUEST_PERMISSION_GET_ACCOUNTS;

public class KotempsFragment extends Fragment implements EasyPermissions.PermissionCallbacks {

    public static KotempsViewModel kotempsViewModel;

    private Button saveButton;
    private Button refreshButton;
    private Button nextButton;

    private CompactCalendarView calendarView;

    private TextView title, titleMonth, description, location, participant, hour1, minute1, year, month, day, hour2, minute2;
    
    private String selectedDate;
    private ArrayList<ScheduledEvents> scheduledEventsList = new ArrayList<ScheduledEvents>();
    private ArrayList<ScheduledEvents> todaysEvents = new ArrayList<ScheduledEvents>();
    private SimpleDateFormat dateFormatMonth = new SimpleDateFormat("MMMM- yyyy", Locale.getDefault());
    private int compteur = 0;

    @RequiresApi(api = Build.VERSION_CODES.O)
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        kotempsViewModel = new KotempsViewModel(this, getContext(), getActivity());
        View root = inflater.inflate(R.layout.fragment_kotemps, container, false);

        titleMonth = root.findViewById(R.id.textView);
        titleMonth.setText(dateFormatMonth.format(new Date()));

        title = root.findViewById(R.id.editText);
        description = root.findViewById(R.id.editTextDescription);
        location = root.findViewById(R.id.editTextLocation);
        participant = root.findViewById(R.id.editTextParticipant);
        hour1 = root.findViewById(R.id.editTextHour1);
        minute1 = root.findViewById(R.id.editTextMinute1);
        year = root.findViewById(R.id.editTextYear);
        month = root.findViewById(R.id.editTextMonth);
        day = root.findViewById(R.id.editTextDay);
        hour2 = root.findViewById(R.id.editTextHour2);
        minute2 = root.findViewById(R.id.editTextMinute2);
        
        calendarView = (CompactCalendarView) root.findViewById(R.id.calendarView);
        calendarView.setUseThreeLetterAbbreviation(false);

        calendarView.setListener(new CompactCalendarView.CompactCalendarViewListener() {

            @Override
            public void onDayClick(Date dateClicked){
                String yearClicked = Integer.toString(dateClicked.getYear()+1900);
                int monthClicked = dateClicked.getMonth()+1;
                int dayClicked = dateClicked.getDate();
                String mth = Integer.toString(monthClicked);
                String dy = Integer.toString(dayClicked);
                if (monthClicked < 10){
                    mth = "0" + mth;
                }
                if (dayClicked < 10){
                    dy = "0" + dy;
                }
                selectedDate = yearClicked + mth + dy;
                compteur = 0;
                getTodaysEvent();
            }

            @Override
            public void onMonthScroll(Date firstDayOfNewMonth){
                titleMonth.setText(dateFormatMonth.format(firstDayOfNewMonth));
                compteur = 0;
            }

        });

        saveButton = root.findViewById(R.id.buttonSave);
        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                sendEvent();
            }
        });

        refreshButton = root.findViewById(R.id.buttonRefresh);
        refreshButton.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void onClick(View view) {
                calendarView.removeAllEvents();
                getEvents();
            }
        });

        nextButton = root.findViewById(R.id.Next);
        nextButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                compteur++;
                afficherEvent();
            }
        });

        getEvents();
        return root;
    }

    public void sendEvent(){
        //Ajouter une vérification des champs et notification si un des champs est incorrect
        ScheduledEvents event = new ScheduledEvents(title.getText().toString(), description.getText().toString(), participant.getText().toString()
                                                , location.getText().toString(), selectedDate + hour1.getText().toString() + minute1.getText().toString(),
                                                year.getText().toString() + month.getText().toString() + day.getText().toString() + hour2.getText().toString() +
                                                minute2.getText().toString());

        kotempsViewModel.createEvent(event);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public void getEvents(){
        scheduledEventsList = kotempsViewModel.getEventsList();

        for (ScheduledEvents event : scheduledEventsList){
            //String startTime = dayBefore(event.getStartDate());
            String startTime = event.getStartDate();
            String timestamp = "" + startTime.substring(0,4) + "-" + startTime.substring(4,6) + "-" + startTime.substring(6,8) + "T" + startTime.substring(8,10) + ":" + startTime.substring(10,12) + ":00";
            Event ev = new Event(Color.RED, timestampToEpoch(timestamp), event.getEventSummery());
            calendarView.addEvent(ev);
            String endTime = event.getEndDate();
            //startTime = nextDay(startTime);
            String temp = startTime;

            while(Long.parseLong(temp.substring(0,8)) <= Long.parseLong(endTime.substring(0,8)) && !(startTime.substring(0,8).equals(endTime.substring(0,8)))){
                timestamp = "" + temp.substring(0,4) + "-" + temp.substring(4,6) + "-" + temp.substring(6,8) + "T" + temp.substring(8,10) + ":" + temp.substring(10,12) + ":00";
                ev = new Event(Color.RED, timestampToEpoch(timestamp), event.getEventSummery());
                calendarView.addEvent(ev);
                temp = nextDay(temp);
            }
        }
    }

    public void getTodaysEvent(){
        todaysEvents.clear();
        for(ScheduledEvents event : scheduledEventsList) {
            if (Long.parseLong(event.getStartDate().substring(0,8)) <= Long.parseLong(selectedDate.substring(0,8)) && Long.parseLong(selectedDate.substring(0,8)) <= Long.parseLong(event.getEndDate().substring(0,8))){
                todaysEvents.add(event);
            }
        }
        afficherEvent();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public long timestampToEpoch(String timestamp){
        if(timestamp == null) return 0;

        LocalDateTime date = LocalDateTime.parse(timestamp);
        long l = date.toEpochSecond(ZoneOffset.MIN) * 1000;
        return l;
    }

    public void afficherEvent(){
        if(compteur != 0 && compteur == (todaysEvents.size()+1)){
            compteur --;
        }
        if(compteur != todaysEvents.size()){
            System.out.println(todaysEvents.get(compteur));
            kotempsViewModel.setCurrentEvent(todaysEvents.get(compteur));
            hour1.setText(kotempsViewModel.getCurrentEvent().getStartDate().substring(8,10));
            minute1.setText(kotempsViewModel.getCurrentEvent().getStartDate().substring(10,12));
            year.setText(kotempsViewModel.getCurrentEvent().getEndDate().substring(0,4));
            month.setText(kotempsViewModel.getCurrentEvent().getEndDate().substring(4,6));
            day.setText(kotempsViewModel.getCurrentEvent().getEndDate().substring(6,8));
            hour2.setText(kotempsViewModel.getCurrentEvent().getEndDate().substring(8,10));
            minute2.setText(kotempsViewModel.getCurrentEvent().getEndDate().substring(10,12));
        }
        else {
            kotempsViewModel.setCurrentEvent(new ScheduledEvents("Event Name", "Description", "Participant", "Location", "Hour-Minute", "Year-Month-Day-Hour-Minute"));
            hour1.setText("00");
            minute1.setText("00");
            year.setText(selectedDate.substring(0,4));
            month.setText(selectedDate.substring(4,6));
            day.setText(selectedDate.substring(6,8));
            hour2.setText("00");
            minute2.setText("00");

        }
        ScheduledEvents currentEvent = kotempsViewModel.getCurrentEvent();
        title.setText(currentEvent.getEventSummery());
        description.setText(currentEvent.getDescription());
        location.setText(currentEvent.getLocation());
        participant.setText(currentEvent.getAttendees());
    }

    public String nextDay(String dayToChange){
        String yearTmp = dayToChange.substring(0,4);
        String monthTmp = dayToChange.substring(4,6);
        String dayTmp = dayToChange.substring(6,8);

        if ((Integer.parseInt(dayTmp) != 30 && !(monthTmp.equals("01") || monthTmp.equals("03") || monthTmp.equals("05") ||
                monthTmp.equals("07") || monthTmp.equals("08") || monthTmp.equals("10") ||monthTmp.equals("12"))) || Integer.parseInt(dayTmp) != 31
                || (Integer.parseInt(dayTmp) != 28 && !monthTmp.equals("02"))){
            if (Integer.parseInt(dayTmp) < 9){
                dayTmp = "0" + (Integer.parseInt(dayTmp)+1);
            }
            else{
                dayTmp = "" + (Integer.parseInt(dayTmp)+1);
            }
        }
        else if (monthTmp.equals("12")){
            dayTmp = "01";
            monthTmp = "01";
            yearTmp = "" + (Integer.parseInt(yearTmp)+1);
        }
        else {
            dayTmp = "01";
            if (Integer.parseInt(monthTmp) < 9){
                monthTmp = "0" + (Integer.parseInt(monthTmp)+1);
            }
            else{
                monthTmp = "" + (Integer.parseInt(monthTmp)+1);
            }
        }

        return "" + yearTmp + monthTmp + dayTmp + dayToChange.substring(8,10) + dayToChange.substring(10,12);
    }

    public String dayBefore(String dayToChange){
        String yearTmp = dayToChange.substring(0,4);
        String monthTmp = dayToChange.substring(4,6);
        String dayTmp = dayToChange.substring(6,8);

        if (Integer.parseInt(dayTmp) != 01){
            if (Integer.parseInt(dayTmp) < 11){
                dayTmp = "0" + (Integer.parseInt(dayTmp)-1);
            }
            else{
                dayTmp = "" + (Integer.parseInt(dayTmp)-1);
            }
        }
        else if (monthTmp.equals("01")){
            dayTmp = "31";
            monthTmp = "12";
            yearTmp = "" + (Integer.parseInt(yearTmp)-1);
        }
        else {
            if (Integer.parseInt(monthTmp) < 11){
                monthTmp = "0" + (Integer.parseInt(monthTmp)-1);
            }
            else{
                monthTmp = "" + (Integer.parseInt(monthTmp)-1);
            }

            if(Integer.parseInt(monthTmp) == 11 || Integer.parseInt(monthTmp) == 9 || Integer.parseInt(monthTmp) == 6 || Integer.parseInt(monthTmp) == 4){
                dayTmp = "30";
            }
            else if (Integer.parseInt(monthTmp) == 2){
                dayTmp = "28";
            }
            else {
                dayTmp = "31";
            }
        }

        return "" + yearTmp + monthTmp + dayTmp + dayToChange.substring(8,10) + dayToChange.substring(10,12);
    }

    public void chooseAccount(GoogleAccountCredential credential, int param){
        startActivityForResult(
                credential.newChooseAccountIntent(),
                param);
    }

    public void error(Intent intent, int param){
        startActivityForResult(intent, param);
    }

    @AfterPermissionGranted(REQUEST_PERMISSION_GET_ACCOUNTS)
    public void requestPermission(String str, int param){
        EasyPermissions.requestPermissions(
                this,
                str,
                param,
                Manifest.permission.GET_ACCOUNTS);
    }

    @Override
    public void onPermissionsGranted(int requestCode, List<String> list) {
        // Do nothing.
    }


    @Override
    public void onPermissionsDenied(int requestCode, List<String> list) {
        // Do nothing.
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        EasyPermissions.onRequestPermissionsResult(
                requestCode, permissions, grantResults, this);
    }

    @Override
    public void onActivityResult(
            int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch(requestCode) {
            case KotempsViewModel.REQUEST_GOOGLE_PLAY_SERVICES:
                if (resultCode != getActivity().RESULT_OK) {
                    //Mettre une notification plutôt
                    System.out.println(
                            "This app requires Google Play Services. Please install " +
                                    "Google Play Services on your device and relaunch this app.");
                } else {
                    KotempsFragment.kotempsViewModel.getResultsFromApi();
                }
                break;
            case KotempsViewModel.REQUEST_ACCOUNT_PICKER:
                if (resultCode == getActivity().RESULT_OK && data != null &&
                        data.getExtras() != null) {
                    String accountName =
                            data.getStringExtra(AccountManager.KEY_ACCOUNT_NAME);
                    if (accountName != null) {
                        SharedPreferences settings =
                                getActivity().getPreferences(Context.MODE_PRIVATE);
                        SharedPreferences.Editor editor = settings.edit();
                        editor.putString(KotempsViewModel.PREF_ACCOUNT_NAME, accountName);
                        editor.apply();
                        KotempsViewModel.mCredential.setSelectedAccountName(accountName);
                        KotempsFragment.kotempsViewModel.getResultsFromApi();
                    }
                }
                break;
            case KotempsViewModel.REQUEST_AUTHORIZATION:
                if (resultCode == getActivity().RESULT_OK) {
                    KotempsFragment.kotempsViewModel.getResultsFromApi();
                }
                break;
        }
    }
}