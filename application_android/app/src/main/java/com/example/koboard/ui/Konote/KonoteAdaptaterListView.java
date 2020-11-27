package com.example.koboard.ui.Konote;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Filter;
import android.widget.ImageButton;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import com.example.koboard.R;
import com.example.koboard.httpUtils.HttpSupprimerNote;
import com.example.koboard.model.Note;
import com.example.koboard.model.Utilisateur;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Locale;

public class KonoteAdaptaterListView extends ArrayAdapter<Note> {

    private Context mContext;
    int mRessource;
    private ArrayList<Note> listNoteRef;
    private ArrayList<Note> listNote;
    private ArrayList<Note> flistNote;
    private ArrayList<Utilisateur> listUtilisateur;
    private Filter filter;
    private KonoteAdaptaterListView object = this;

    public KonoteAdaptaterListView(@NonNull Context context, int resource, @NonNull ArrayList<Note> objects, ArrayList<Utilisateur> listUtilisateur) {
        super(context, resource, objects);
        this.mContext = context;
        this.mRessource = resource;
        this.listNoteRef = objects;
        this.listNote = new ArrayList<Note>(objects);
        this.flistNote = new ArrayList<Note>(objects);
        this.listUtilisateur = listUtilisateur;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        LayoutInflater inflater = LayoutInflater.from(mContext);
        convertView = inflater.inflate(mRessource, parent, false);

        final Note note = getItem(position);
        Utilisateur utilisateur = null;
        for(Utilisateur utilisateurBoucle : listUtilisateur) {
            if(utilisateurBoucle.getId().equals(note.getIdAuthor())) {
                utilisateur = utilisateurBoucle;
            }
        }

        TextView tv_titre_note = convertView.findViewById(R.id.tv_titre_note);
        TextView tv_date_note = convertView.findViewById(R.id.tv_date_note);
        TextView tv_author = convertView.findViewById(R.id.tv_author);

        tv_titre_note.setText(note.getTitre());
        if(utilisateur != null)
            tv_author.setText(utilisateur.getUsername());
        else
            tv_author.setText("Inconnue");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        formatter = formatter.withLocale(Locale.FRANCE);
        tv_date_note.setText(note.getDate().format(formatter));

        ImageButton btn_note_supprimer = convertView.findViewById(R.id.btn_note_supprimer);


        btn_note_supprimer.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
                builder.setMessage("Etes-vous sûr de vouloir supprimer cette note ?");
                builder.setPositiveButton("Oui", new DialogInterface.OnClickListener() {
                    public void onClick(final DialogInterface dialog, int id) {
                        new HttpSupprimerNote(note, new HttpSupprimerNote.AsyncResponse() {
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
                                    listNoteRef.remove(note);
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

    @Override
    public Filter getFilter()
    {
        if (filter == null)
            filter = new NoteFilter();

        return filter;
    }

    private class NoteFilter extends Filter
    {
        @Override
        protected FilterResults performFiltering(CharSequence constraint)
        {
            FilterResults results = new FilterResults();
            String recherche = constraint.toString().toLowerCase();

            if (recherche == null || recherche.length() == 0)
            {
                ArrayList<Note> list = new ArrayList<Note>(listNote);
                results.values = list;
                results.count = list.size();
            }
            else
            {
                final ArrayList<Note> list = new ArrayList<Note>(listNote);
                final ArrayList<Note> nlist = new ArrayList<Note>();
                int count = list.size();

                for (int i=0; i<count; i++)
                {
                    final Note note = list.get(i);
                    final String value = note.getTitre().toLowerCase();

                    if (value.contains(recherche))
                    {
                        nlist.add(note);
                    }
                }
                results.values = nlist;
                results.count = nlist.size();
            }
            return results;
        }

        @SuppressWarnings("unchecked")
        @Override
        protected void publishResults(CharSequence constraint, FilterResults results) {
            flistNote = (ArrayList<Note>)results.values;

            clear();
            int count = flistNote.size();
            for (int i=0; i<count; i++)
            {
                Note note = (Note)flistNote.get(i);
                add(note);
            }
        }

    }
}
