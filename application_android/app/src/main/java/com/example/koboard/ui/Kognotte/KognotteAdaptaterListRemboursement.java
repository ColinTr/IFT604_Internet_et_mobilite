package com.example.koboard.ui.Kognotte;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.example.koboard.R;
import com.example.koboard.model.Participant;
import com.example.koboard.model.Remboursement;
import com.example.koboard.model.Utilisateur;

import java.util.ArrayList;

public class KognotteAdaptaterListRemboursement extends ArrayAdapter<Remboursement> {

    private Context context;
    int mRessource;
    ArrayList<Remboursement> listRemboursement;
    ArrayList<Utilisateur> listUtilisateur;


    public KognotteAdaptaterListRemboursement(@NonNull Context context, int resource, @NonNull ArrayList<Remboursement> objects, ArrayList<Utilisateur> listUtilisateur) {
        super(context, resource, objects);
        this.context = context;
        this.mRessource = resource;
        this.listRemboursement = objects;
        this.listUtilisateur = listUtilisateur;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = LayoutInflater.from(context);
        convertView = inflater.inflate(R.layout.element_detail_remboursement, parent, false);
        Remboursement remboursement = getItem(position);
        Utilisateur debiteur = getParticipantById(listUtilisateur, remboursement.getIdDeb());

        TextView tv_name_debitaire = convertView.findViewById(R.id.tv_name_debitaire);
        TextView tv_montant_remboursement = convertView.findViewById(R.id.tv_montant_remboursement);

        tv_name_debitaire.setText(debiteur.getUsername());
        double montant = remboursement.getMontant();
        if(montant < 0) {
            tv_montant_remboursement.setText("- " + Math.abs(montant) + " €");
            tv_montant_remboursement.setTextColor(Color.parseColor("#BA6E6E"));
        }

        else if (montant > 0){
            tv_montant_remboursement.setText("+ " + montant + " €");
            tv_montant_remboursement.setTextColor(Color.parseColor("#6EBA6E"));
        }
        else {
            tv_montant_remboursement.setText(montant + " €");
            tv_montant_remboursement.setTextColor(Color.parseColor("#000000"));
        }


        return convertView;
    }

    public Utilisateur getParticipantById(ArrayList<Utilisateur> listUtilisateur, String idUtilisateur) {
        for(Utilisateur item : listUtilisateur) {
            if(item.getId().equals(idUtilisateur)) {
                return item;
            }
        }
        return null;
    }
}
