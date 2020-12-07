package com.example.koboard.ui.Kognotte;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.example.koboard.R;
import com.example.koboard.model.Participant;
import com.example.koboard.model.Remboursement;
import com.example.koboard.model.Solde;
import com.example.koboard.model.Utilisateur;

import java.util.ArrayList;

public class KognotteFragmentListDettes extends Fragment {

    private ArrayList<Utilisateur> listUtilisateur;
    private ArrayList<Solde> listSoldes;
    private ArrayList<Remboursement> listRemboursement;
    private Utilisateur utilisateurActuel;

    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_kognotte_detail, container, false);

        listUtilisateur = (ArrayList<Utilisateur>) getArguments().getSerializable("utilisateurs");
        listSoldes = (ArrayList<Solde>) getArguments().getSerializable("soldes");
        String idUtilisateurActuel = getArguments().getString("idUtilisateurActuel");
        utilisateurActuel = getUtilisateur(idUtilisateurActuel);


        listRemboursement = getRemboursementUtilisateurActuel(Solde.calculerRemboursements(listSoldes));

        KognotteAdaptaterListRemboursement adaptaterListRemboursement = new KognotteAdaptaterListRemboursement(getContext(), R.layout.element_detail_remboursement, listRemboursement, listUtilisateur);

        ListView lv = root.findViewById(R.id.lv_dettes);
        lv.setAdapter(adaptaterListRemboursement);


        TextView tv_name_user = root.findViewById(R.id.tv_name_user);
        TextView tv_montant = root.findViewById(R.id.tv_montant);
        tv_name_user.setText(utilisateurActuel.getUsername());

        double montant = getTotalRemboursement(listRemboursement);
        montant = (double) Math.round(montant * 100) / 100;

        if(montant >= 0) {
            tv_montant.setText("+ " + montant + " €");
            tv_montant.setTextColor(Color.parseColor("#6EBA6E"));
        }
        else {
            tv_montant.setText("- " + Math.abs(montant) + " €");
            tv_montant.setTextColor(Color.parseColor("#BA6E6E"));
        }

        return root;
    }

    public ArrayList<Remboursement> getRemboursementUtilisateurActuel (ArrayList<Remboursement> listRemboursement) {
        ArrayList<Remboursement> remboursementArrayList = new ArrayList<>();

        ArrayList<String> idRemboursement = new ArrayList<>();

        for(Remboursement remboursement : listRemboursement) {
            if(remboursement.getIdBenef().equals(utilisateurActuel.getId())) {
                remboursementArrayList.add(remboursement);
                idRemboursement.add(remboursement.getIdDeb());
            }
            else if(remboursement.getIdDeb().equals(utilisateurActuel.getId())) {
                remboursementArrayList.add(new Remboursement(remboursement.getIdBenef(), remboursement.getMontant()*(-1), remboursement.getIdDeb()));
                idRemboursement.add(remboursement.getIdBenef());
            }
        }

        for(Solde solde : listSoldes) {
            if(solde.getUserId() != utilisateurActuel.getId()) {
                if(!idRemboursement.contains(solde.getUserId())) {
                    remboursementArrayList.add(new Remboursement(solde.getUserId(), 0, utilisateurActuel.getId()));
                }
            }
        }

        return remboursementArrayList;
    }

    public double getTotalRemboursement(ArrayList<Remboursement> listRemboursement) {
        double total = 0;
        for(Remboursement remboursement : listRemboursement) {
            total += remboursement.getMontant();
        }
        return total;
    }

    public Utilisateur getUtilisateur(String idUtilisateur) {
        for(Utilisateur user : listUtilisateur) {
            if(user.getId().equals(idUtilisateur)) {
                return user;
            }
        }
        return null;
    }
}
