package com.example.koboard.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.example.koboard.MainActivity;
import com.example.koboard.R;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Random;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private final String CHANNEL_ID = "my_channel";

    @Override
    public void onNewToken(@NonNull String token) {
        Log.d("MyFireBaseMessaging", "Resfresh token : " + token);
        getSharedPreferences("userdetails", MODE_PRIVATE).edit().putString("firebase_token", token).apply();
        super.onNewToken(token);
    }

    public static String getToken(Context context) {
        String token = context.getSharedPreferences("userdetails", MODE_PRIVATE).getString("firebase_token", "empty");
        Log.d("MyFireBaseMessaging", "Get token : " + token);
        return token;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        Intent intent = new Intent(this, MainActivity.class);
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        Random random = new Random();
        int notificationID = random.nextInt();

        createNotificationChannel(notificationManager);

        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);
        System.out.println(remoteMessage.getNotification());
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID).setContentTitle(remoteMessage.getNotification().getTitle()).setContentText(remoteMessage.getNotification().getBody()).setAutoCancel(true).setContentIntent(pendingIntent).setSmallIcon(R.drawable.logo_koboard_crop).build();
        notificationManager.notify(notificationID, notification);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createNotificationChannel(NotificationManager notificationManager) {
        String channelName = "channelName";
        NotificationChannel channel = new NotificationChannel(CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_HIGH);
        channel.setDescription("My channel description");
        channel.enableLights(true);
        channel.setLightColor(Color.GREEN);

        notificationManager.createNotificationChannel(channel);
    }
}
