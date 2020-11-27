package com.example.koboard.model;

import java.util.ArrayList;

public class Solde {

    private String id;
    private String dashboardId;
    private String userId;
    private double montant;

    public Solde(String id, String dashboardId, String userId, double montant) {
        this.id = id;
        this.dashboardId = dashboardId;
        this.userId = userId;
        this.montant = montant;
    }

    public Solde(String userId, double montant) {
        this.id = "-1";
        this.dashboardId = "-1";
        this.userId = userId;
        this.montant = montant;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDashboardId() {
        return dashboardId;
    }

    public void setDashboardId(String dashboardId) {
        this.dashboardId = dashboardId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public static ArrayList<Remboursement> calculerRemboursements(ArrayList<Solde> listSoldes) {
        if(listSoldes == null || listSoldes.size() == 0) {
            throw new IllegalArgumentException();
        }

        ArrayList<Remboursement> result = new ArrayList<Remboursement>();
        boolean finished = false;
        do {
            Solde maxCrediteur = null;
            Solde  maxDebiteur = null;

            for (Solde p : listSoldes) {
                if ((maxCrediteur== null) || (p.getMontant()>maxCrediteur.getMontant())) {
                    maxCrediteur = p;
                }
                if ((maxDebiteur== null) || (p.getMontant()<maxDebiteur.getMontant())) {
                    maxDebiteur = p;
                }
            }

            if(Math.abs(maxCrediteur.getMontant())<0.20) {
                finished = true;
            }
            else {
                double montantRemb100 = 100*Math.min(Math.abs(maxCrediteur.getMontant()), Math.abs(maxDebiteur.getMontant()));
                double montantRemb = Math.round(montantRemb100)/100.0;
                Remboursement remb = new Remboursement(maxDebiteur.getUserId(), montantRemb,maxCrediteur.getUserId());
                maxCrediteur.montant -= montantRemb;
                maxDebiteur.montant += montantRemb;
                result.add(remb);
            }

        } while (finished == false);

        return result;

    }
}
