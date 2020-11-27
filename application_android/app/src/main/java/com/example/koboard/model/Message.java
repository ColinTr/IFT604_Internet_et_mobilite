package com.example.koboard.model;

public class Message {

    public static final int MESSAGE_TYPE = 0;
    public static final int LOG_TYPE = 1;

    private int type;
    private String message;
    private String user;

    public Message() {

    }

    public Message(int type, String message, String user){
        this.type = type;
        this.message = message;
        this.user = user;
    }

    public Message(int type, String user, int i){
        this.type = type;
        this.user = user;
    }

    public Message(int type, String message){
        this.type = type;
        this.message = message;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
