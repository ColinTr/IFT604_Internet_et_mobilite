package com.example.koboard.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;

public class Note implements Serializable {

    private String id;
    private String idDashboard;
    private String titre;
    private String content;
    private String idAuthor;
    private ArrayList<String> taggedUsers;
    private LocalDate date;

    public Note(String id, String content, String titre, String idAuthor, LocalDate date) {
        this.id = id;
        this.content = content;
        this.titre = titre;
        this.idAuthor = idAuthor;
        this.date = date;
    }

    public Note(String id, String content, String titre, String idAuthor, ArrayList<String> taggedUsers, LocalDate date) {
        this.id = id;
        this.content = content;
        this.titre = titre;
        this.idAuthor = idAuthor;
        this.taggedUsers = taggedUsers;
        this.date = date;
    }

    public Note(String id, String idDashboard, String titre, String content, String idAuthor, ArrayList<String> taggedUsers, LocalDate date) {
        this.id = id;
        this.idDashboard = idDashboard;
        this.titre = titre;
        this.content = content;
        this.idAuthor = idAuthor;
        this.taggedUsers = taggedUsers;
        this.date = date;
    }

    public String getIdDashboard() {
        return idDashboard;
    }

    public void setIdDashboard(String idDashboard) {
        this.idDashboard = idDashboard;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getIdAuthor() {
        return idAuthor;
    }

    public void setIdAuthor(String idAuthor) {
        this.idAuthor = idAuthor;
    }

    public ArrayList<String> getTaggedUsers() {
        return taggedUsers;
    }

    public void setTaggedUsers(ArrayList<String> taggedUsers) {
        this.taggedUsers = taggedUsers;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }
}
