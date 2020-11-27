package com.example.koboard.ui.Kognotte;
import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.example.koboard.R;
import com.example.koboard.model.Participant;
import com.example.koboard.model.Solde;
import com.example.koboard.model.Utilisateur;

import java.util.ArrayList;

public class KognotteAdaptaterList extends ArrayAdapter<Solde> {

    private Context context;
    private ArrayList<Solde> listSolde;
    private ArrayList<Utilisateur> listUtilisateur;
    double maxMontant;

    public KognotteAdaptaterList(@NonNull Context context, int resource, @NonNull ArrayList<Solde> objects, ArrayList<Utilisateur> listUtilisateur) {
        super(context, resource, objects);
        this.listSolde = objects;
        this.listUtilisateur = listUtilisateur;
        this.context = context;
        this.maxMontant = getMaxMontant(objects);
    }

    @SuppressLint("ViewHolder")
    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        String nom_utilisateur = getNomUtilisateur(getItem(position).getUserId());
        double montant = getItem(position).getMontant();

        LayoutInflater inflater = LayoutInflater.from(context);
        if(montant >= 0) {
            convertView = inflater.inflate(R.layout.element_green_list_kognotte, parent, false);
        }
        else {
            convertView = inflater.inflate(R.layout.element_red_list_kognotte, parent, false);
        }

        TextView tv_name_user = convertView.findViewById(R.id.tv_name_user);
        TextView tv_montant = convertView.findViewById(R.id.tv_montant);
        ProgressBar progressBar = convertView.findViewById(R.id.progressBar);

        tv_name_user.setText(nom_utilisateur);
        montant = (double) Math.round(montant * 100) / 100;
        tv_montant.setText(montant + " €");

        int progress = (int)(Math.abs(montant)*100/maxMontant);
        progressBar.setProgress(progress);

        return convertView;

    }

    public double getMaxMontant(ArrayList<Solde> listSolde){
        double max = 0;
        for(Solde solde : listSolde) {
            if(solde.getMontant() > maxMontant){
                max = Math.abs(solde.getMontant());
            }
        }
        return max;
    }

    public String getNomUtilisateur(String idUtilisateur) {
        for(Utilisateur user : listUtilisateur) {
            if(user.getId().equals(idUtilisateur)) {
                return user.getUsername();
            }
        }
        return null;
    }

}
