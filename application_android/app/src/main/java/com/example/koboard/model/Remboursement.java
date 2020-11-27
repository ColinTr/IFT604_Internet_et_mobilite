package com.example.koboard.model;

public class Remboursement {


    private String idDeb;
    private String idBenef;
    private double montant;



    public Remboursement(String idDeb, double montant, String idBenef) {
        super();
        this.idDeb = idDeb;
        this.idBenef = idBenef;
        this.montant = montant;

    }

    public String getIdDeb() {
        return idDeb;
    }

    public void setIdDeb(String idDeb) {
        this.idDeb = idDeb;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public String getIdBenef() {
        return idBenef;
    }

    public void setIdBenef(String idBenef) {
        this.idBenef = idBenef;
    }
}
