package com.example.koboard.model;

import androidx.annotation.NonNull;

public class Utilisateur{

    private String id;
    private String username;

    public Utilisateur(String username) {
        this.username = username;
    }

    public Utilisateur(String id, String username) {
        this.id = id;
        this.username = username;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @NonNull
    @Override
    public String toString() {
        return username;
    }
}
