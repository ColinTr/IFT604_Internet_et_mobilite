package com.example.koboard.services;

import android.app.IntentService;
import android.content.Intent;

import androidx.annotation.Nullable;

import com.example.koboard.AppLifecycleListener;

public class RefreshService extends IntentService {

    public static String BROADCAST_ACTION = "com.example.koboard.REFRESH";

    private final int INTERVAL = 5 * 1000;

    public RefreshService() {
        super("refreshService");
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        do {
            try {
                if (!AppLifecycleListener.isApplicationBackground) {
                    Intent broadcast = new Intent();
                    broadcast.setAction(BROADCAST_ACTION);
                    sendBroadcast(broadcast);
                }
                Thread.sleep(INTERVAL);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        } while (true);
    }
}
