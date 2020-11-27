package com.example.koboard.ui.Kognotte;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.example.koboard.R;
import com.example.koboard.httpUtils.HttpSupprimerTransaction;
import com.example.koboard.model.Transaction;
import com.example.koboard.model.Participant;
import com.example.koboard.model.Utilisateur;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Locale;

public class KognotteHistoriqueDepenseAdaptater extends ArrayAdapter<Transaction> {

    private Context context;
    int mResource;
    private ArrayList<Transaction> listTransaction;
    private ArrayList<Utilisateur> listUtilisateur;
    private KognotteHistoriqueDepenseAdaptater object = this;

    public KognotteHistoriqueDepenseAdaptater(@NonNull Context context, int resource, @NonNull ArrayList<Transaction> objects, ArrayList<Utilisateur> listUtilisateur) {
        super(context, resource, objects);
        this.context = context;
        this.mResource = resource;
        this.listUtilisateur = listUtilisateur;
        this.listTransaction = objects;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = LayoutInflater.from(context);
        convertView = inflater.inflate(mResource, parent, false);

        final Transaction transaction = getItem(position);
        Utilisateur utilisateur = getUtilisateurFromList(transaction.getIdPayeur(), listUtilisateur);
        ArrayList<Utilisateur> listProfiteurs = getAllProfiteursFromList(transaction.getProfiteurs(), listUtilisateur);

        TextView tv_paye_par = convertView.findViewById(R.id.tv_paye_par);
        TextView tv_montant_historique = convertView.findViewById(R.id.tv_montant_historique);
        TextView tv_participants = convertView.findViewById(R.id.tv_participants);
        TextView tv_object_depense = convertView.findViewById(R.id.tv_object_depense);
        TextView tv_date_depense = convertView.findViewById(R.id.tv_date_depense);

        tv_paye_par.setText(utilisateur.getUsername());
        tv_montant_historique.setText(transaction.getMontant() + " €");
        tv_object_depense.setText(transaction.getObject());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy");
        formatter = formatter.withLocale(Locale.FRANCE);
        tv_date_depense.setText(transaction.getDate().format(formatter));

        String listProfiteursString = "";
        for(Utilisateur profiteur : listProfiteurs) {
            listProfiteursString += profiteur.getUsername() + "\n";
        }

        tv_participants.setText(listProfiteursString);

        ImageButton btn_delete_depense = convertView.findViewById(R.id.btn_delete_depense);
        btn_delete_depense.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
                builder.setMessage("Etes-vous sûr de vouloir supprimer cette dépense ?");
                builder.setPositiveButton("Oui", new DialogInterface.OnClickListener() {
                    public void onClick(final DialogInterface dialog, int id) {
                        new HttpSupprimerTransaction(transaction, new HttpSupprimerTransaction.AsyncResponse() {
                            @Override
                            public void processFinish(boolean error) {
                                if(error) {
                                    AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
                                    builder.setMessage("Une erreur est survenue dans la communication avec le serveur")
                                            .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                                                public void onClick(DialogInterface dialog, int id) {
                                                }
                                            }).setTitle("Erreur");
                                    builder.create();
                                    builder.show();
                                }
                                else {
                                    dialog.dismiss();
                                    listTransaction.remove(transaction);
                                    object.notifyDataSetChanged();
                                }
                            }
                        }, getContext()).execute();
                    }
                });
                builder.setNegativeButton("Non", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        dialog.dismiss();
                    }
                });
                AlertDialog alert = builder.create();
                alert.show();
            }
        });

        return convertView;
    }

    public Utilisateur getUtilisateurFromList(String idUtilisateur, ArrayList<Utilisateur> listUtilisateur) {
        for(Utilisateur utilisateur : listUtilisateur) {
            if(idUtilisateur.equals(utilisateur.getId())) {
                return utilisateur;
            }
        }
        return null;
    }

    public ArrayList<Utilisateur> getAllProfiteursFromList(ArrayList<String> idListUtilisateur, ArrayList<Utilisateur> listutilisateur) {
        ArrayList<Utilisateur> utilisateurs = new ArrayList<>();

        for(String idUtilisateur : idListUtilisateur) {
            for (Utilisateur utilisateur : listutilisateur) {
                if (idUtilisateur.equals(utilisateur.getId())) {
                    utilisateurs.add(utilisateur);
                }
            }
        }
        return utilisateurs;
    }
}
