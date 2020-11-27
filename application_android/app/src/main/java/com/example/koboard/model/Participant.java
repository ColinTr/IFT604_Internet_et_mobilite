package com.example.koboard.model;

import java.io.Serializable;

public class Participant implements Serializable {

    private String id;
    private int userId;
    private String pseudo;
    private double solde;


    public Participant(String id, String pseudo, double solde) {

        this.id= id;
        this.pseudo = pseudo;
        this.solde = solde;
    }

    public String getId() {
        return id;
    }

    public String getPseudo() {
        return pseudo;
    }

    public double getSolde() {
        return solde;
    }

    @Override
    public String toString() {
        return getPseudo();
    }
}
