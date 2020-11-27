package com.example.koboard.Notification;

public class PushNotification {
    private NotificationsData data;
    private String to;

    public PushNotification(NotificationsData data, String to) {
        this.data = data;
        this.to = to;
    }

    public NotificationsData getData() {
        return data;
    }

    public void setData(NotificationsData data) {
        this.data = data;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }
}
