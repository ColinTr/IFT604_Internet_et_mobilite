package com.example.koboard.ui.Konote;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;

import com.example.koboard.GlobalClass;
import com.example.koboard.Notification.NotificationsData;
import com.example.koboard.Notification.NotificationsSender;
import com.example.koboard.Notification.PushNotification;
import com.example.koboard.R;
import com.example.koboard.httpUtils.HtppModifierNote;
import com.example.koboard.httpUtils.HttpCreerNote;
import com.example.koboard.httpUtils.HttpRecupererUtilisateurs;
import com.example.koboard.httpUtils.HttpSupprimerNote;
import com.example.koboard.model.Note;
import com.example.koboard.model.Utilisateur;
import com.hendraanggrian.appcompat.socialview.Mention;
import com.hendraanggrian.appcompat.widget.MentionArrayAdapter;
import com.hendraanggrian.appcompat.widget.SocialAutoCompleteTextView;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class KonoteFragmentDetailNote extends Fragment {

    private boolean modification;
    private Note noteActuel;
    private ArrayList<Utilisateur> listUtilisateur;

    @RequiresApi(api = Build.VERSION_CODES.O)
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_konote_detail_note, container, false);

        Button btn_note_valide = root.findViewById(R.id.btn_note_valide);
        Button btn_note_annuler = root.findViewById(R.id.btn_note_annuler);

        this.modification = getArguments().getBoolean("modification");
        this.listUtilisateur = (ArrayList<Utilisateur>) getArguments().getSerializable("utilisateurs");
        if(modification) {
            this.noteActuel = (Note) getArguments().getSerializable("note");
        }
        else {
            this.noteActuel = new Note("-1", "", "Sans Titre", "-1", LocalDate.now());
        }

        final EditText tv_note_titre = root.findViewById(R.id.tv_note_titre);
        final SocialAutoCompleteTextView tv_note_content = root.findViewById(R.id.tv_note_content);

        tv_note_titre.setText(noteActuel.getTitre());
        tv_note_content.setText(noteActuel.getContent());
        btn_note_annuler.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                getActivity().onBackPressed();
            }
        });

        btn_note_valide.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(!tv_note_content.getText().toString().equals(""))
                {
                    List<String> list = tv_note_content.getMentions();
                    ArrayList<String> listIdUtilisateurMentione = new ArrayList<>();
                    for (String nomMention : list) {
                        for (Utilisateur utilisateur : listUtilisateur) {
                            if (utilisateur.getUsername().contains(nomMention)) {
                                if (!listIdUtilisateurMentione.contains(utilisateur.getId())) {
                                    listIdUtilisateurMentione.add(utilisateur.getId());
                                }
                            }
                        }
                    }
                    noteActuel.setContent(tv_note_content.getText().toString());
                    noteActuel.setTitre(tv_note_titre.getText().toString());
                    noteActuel.setDate(LocalDate.now());
                    noteActuel.setIdAuthor(GlobalClass.getUser().getId());
                    noteActuel.setTaggedUsers(listIdUtilisateurMentione);
                    if(!modification) {
                        new HttpCreerNote(noteActuel, new HttpCreerNote.AsyncResponse() {
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
                                    for(String idUtilisateur : noteActuel.getTaggedUsers()) {
                                        sendNotification(idUtilisateur, noteActuel.getTitre());
                                    }
                                    getActivity().onBackPressed();
                                }
                            }
                        }, getContext()).execute();
                    }
                    else {
                        new HtppModifierNote(noteActuel, new HtppModifierNote.AsyncResponse() {
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
                                    for(String idUtilisateur : noteActuel.getTaggedUsers()) {
                                        sendNotification(idUtilisateur, noteActuel.getTitre());
                                    }
                                    getActivity().onBackPressed();
                                }
                            }
                        }, getContext()).execute();
                    }

                }
                else {
                    AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
                    builder.setMessage("Etes-vous sûr de vouloir supprimer cette note ?");
                    builder.setPositiveButton("Oui", new DialogInterface.OnClickListener() {
                        public void onClick(final DialogInterface dialog, int id) {
                            new HttpSupprimerNote(noteActuel, new HttpSupprimerNote.AsyncResponse() {
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
                                    }
                                }
                            }, getContext()).execute();
                            dialog.dismiss();
                            getActivity().onBackPressed();
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
            }
        });

        ArrayAdapter<Mention> defaultMentionAdapter = new MentionArrayAdapter<>(getContext());
        for(Utilisateur utilisateur : listUtilisateur) {
            defaultMentionAdapter.add(new Mention(utilisateur.getUsername()));
        }

        tv_note_content.setMentionAdapter(defaultMentionAdapter);
        return root;
    }

    private void sendNotification(String idUtilisateur, String titreNote) {
        String title = "Koboard";
        String message = GlobalClass.getUser().getUsername() + " vous a mentionné dans la note \"" + titreNote + "\"";
        PushNotification notification = new PushNotification(new NotificationsData(title, message), "/topics/" + idUtilisateur);
        new NotificationsSender(new NotificationsSender.AsyncResponse() {
            @Override
            public void processFinish(boolean error) {
            }
        }, notification,getContext()).execute();
    }

}
