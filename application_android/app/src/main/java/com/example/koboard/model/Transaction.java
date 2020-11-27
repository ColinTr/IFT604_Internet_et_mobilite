package com.example.koboard.model;

import android.os.Build;

import androidx.annotation.RequiresApi;

import java.time.LocalDate;
import java.util.ArrayList;


public class Transaction {

    private String id;
    private String dashboard;
    private String idPayeur;
    private double montant;
    private ArrayList<String> profiteurs;
    private String object;
    private LocalDate date;

    @RequiresApi(api = Build.VERSION_CODES.O)
    public Transaction(String id, String idPayeur, double montant, ArrayList<String> profiteurs) {
        this.id = id;
        this.idPayeur= idPayeur;
        this.montant= montant;
        this.profiteurs = profiteurs;
        this.object = "";
        this.date = LocalDate.now();
    }

    public Transaction(String id, String dashboard, String idPayeur, double montant, ArrayList<String> profiteurs, String object, LocalDate date) {
        this.id = id;
        this.dashboard = dashboard;
        this.idPayeur = idPayeur;
        this.montant = montant;
        this.profiteurs = profiteurs;
        this.object = object;
        this.date = date;
    }

    public String getObject() {
        return object;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setObject(String object) {
        this.object = object;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getIdPayeur() {
        return idPayeur;
    }


    public double getMontant() {
        return montant;
    }


    public ArrayList<String> getProfiteurs() {
        return profiteurs;
    }
}
