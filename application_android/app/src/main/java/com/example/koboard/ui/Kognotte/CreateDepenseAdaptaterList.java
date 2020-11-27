package com.example.koboard.ui.Kognotte;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.example.koboard.R;
import com.example.koboard.model.Participant;
import com.example.koboard.model.Utilisateur;

import java.util.ArrayList;

public class CreateDepenseAdaptaterList extends ArrayAdapter<Utilisateur> {

    private Context mContext;
    private ArrayList<String> idUtilisateursSelected;
    int mRessource;
    boolean[] checkBoxState;
    double[] montant_uti;
    double montant;
    private CheckBox selectAll;
    public static int check_all_status= -1;

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public ArrayList<String> getIdUtilisateursSelected() {
        return idUtilisateursSelected;
    }

    public void setIdUtilisateursSelected(ArrayList<String> idUtilisateursSelected) {
        this.idUtilisateursSelected = idUtilisateursSelected;
    }

    public CreateDepenseAdaptaterList(@NonNull Context context, int resource, @NonNull ArrayList<Utilisateur> objects, CheckBox selectAll) {
        super(context, resource, objects);
        this.mContext = context;
        this.mRessource = resource;
        this.checkBoxState = new boolean[objects.size()];
        this.montant_uti = new double[objects.size()];
        this.montant = 0;
        this.selectAll = selectAll;
        this.idUtilisateursSelected = new ArrayList<>();
    }

    @NonNull
    @Override
    public View getView(final int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        Utilisateur utilisateur = getItem(position);
        String nom_utilisateur = utilisateur.getUsername();

        LayoutInflater inflater = LayoutInflater.from(mContext);
        convertView = inflater.inflate(mRessource, parent, false);

        TextView tv_nom_utilisateur = convertView.findViewById(R.id.tv_nom_utilisateur);
        final TextView tv_montant = convertView.findViewById(R.id.tv_montant);
        CheckBox cb_utilisateur = convertView.findViewById(R.id.cb_utilisateur);

        tv_nom_utilisateur.setText(nom_utilisateur);

        cb_utilisateur.setChecked(checkBoxState[position]);
        if(checkBoxState[position]) {
            if(!idUtilisateursSelected.contains(utilisateur.getId())) {
                idUtilisateursSelected.add(utilisateur.getId());
            }
            montant_uti[position] = montant / getNbTrueList(checkBoxState);
        }
        else {
            if(idUtilisateursSelected.contains(utilisateur.getId())) {
                idUtilisateursSelected.remove(utilisateur.getId());
            }
            montant_uti[position] = 0;
        }

        if (check_all_status==1 ) {
            if(!idUtilisateursSelected.contains(utilisateur.getId())) {
                idUtilisateursSelected.add(utilisateur.getId());
            }
            cb_utilisateur.setChecked(true);
            checkBoxState[position] = true;
            montant_uti[position] = montant/checkBoxState.length;
        }
        else if(check_all_status==0){
            if(idUtilisateursSelected.contains(utilisateur.getId())) {
                idUtilisateursSelected.remove(utilisateur.getId());
            }
            cb_utilisateur.setChecked(false);
            checkBoxState[position] = false;
            montant_uti[position] = 0;
        }

        if(montant_uti[position] != 0) {
            tv_montant.setText(((double) Math.round(montant_uti[position] * 100) / 100) + "€");
        }
        else {
            tv_montant.setText("0,00" + "€");
        }

        cb_utilisateur.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                checkBoxState[position] = isChecked;
                if(isChecked) {
                    montant_uti[position] = montant/getNbTrueList(checkBoxState);
                }
                else{
                    montant_uti[position] = 0;
                }
                boolean isAllCheckSelected = (getNbTrueList(checkBoxState) == checkBoxState.length );

                if((isAllCheckSelected && isChecked)||(check_all_status == 1 && isChecked)){
                    selectAll.setChecked(true);
                    check_all_status=1;
                }
                else if(getNbTrueList(checkBoxState)==0 || check_all_status == 1){
                    selectAll.setChecked(false);
                    check_all_status=-1;
                }
                else if(check_all_status == 0 && isChecked) {
                    check_all_status=-1;
                }

                notifyDataSetChanged();
            }
        });

        return convertView;
    }

    public int getNbTrueList(boolean[] list) {
        int result = 0;
        for(boolean bool : list) {
            if(bool) {
                result++;
            }
        }
        return result;
    }

    public ArrayList<String> getUtilisateursSelected() {
        return idUtilisateursSelected;
    }
}
