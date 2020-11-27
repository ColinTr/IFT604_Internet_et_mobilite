package com.example.koboard.Notification;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.example.koboard.GlobalClass;
import com.example.koboard.httpUtils.HttpUtils;
import com.example.koboard.services.MyFirebaseMessagingService;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class NotificationsSender extends AsyncTask<Void, Void, Boolean> {

    public NotificationsSender.AsyncResponse delegate;
    private PushNotification pushNotification;
    private Context context;

    public interface AsyncResponse {
        void processFinish(boolean error);
    }

    @Override
    protected void onPostExecute(Boolean error) {
        super.onPostExecute(error);
        delegate.processFinish(error);
    }

    public NotificationsSender(NotificationsSender.AsyncResponse delegate, PushNotification pushNotification, Context context) {
        this.context = context;
        this.delegate = delegate;
        this.pushNotification = pushNotification;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected Boolean doInBackground(Void... params) {
        try {
            //Creation du contenu JSON
            JSONObject root = new JSONObject();
            JSONObject notification = new JSONObject();
            notification.put("body", pushNotification.getData().getMessage());
            notification.put("title", pushNotification.getData().getTitle());

            JSONObject data = new JSONObject();
            data.put("senderToken", MyFirebaseMessagingService.getToken(context));
            data.put("messageId", 1);

            root.put("notification", notification);
            root.put("data", data);
            root.put("to", pushNotification.getTo());

            String dataString = root.toString();

            // Initialisation de notre connexion
            URL myURL = new URL(GlobalClass.BASE_URL + "/fcm/send");
            HttpURLConnection connection = (HttpURLConnection) myURL.openConnection();
            connection.setRequestMethod("POST");
            connection.setReadTimeout(HttpUtils.READ_TIMEOUT);
            connection.setConnectTimeout(HttpUtils.CONNECTION_TIMEOUT);

            connection.setRequestProperty("Authorization", "key=" + GlobalClass.SERVER_KEY);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoInput(true);
            connection.setDoOutput(true);
            OutputStream out = new BufferedOutputStream(connection.getOutputStream());
            connection.connect();

            // Envoie de nos données
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"));
            writer.write(dataString);
            writer.flush();
            writer.close();
            out.close();

            try {
                //Récupération de la réponse du serveur
                InputStream in = new BufferedInputStream(connection.getInputStream());
                BufferedReader reader = new BufferedReader(new InputStreamReader(in));
                StringBuilder result = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    result.append(line);
                }

            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }

        } catch (IOException | JSONException e) {
            System.out.println(e.getMessage());
        }

        return false;
    }
}