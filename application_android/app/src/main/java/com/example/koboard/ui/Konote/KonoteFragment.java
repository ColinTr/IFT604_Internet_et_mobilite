package com.example.koboard.ui.Konote;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;

import com.example.koboard.R;
import com.example.koboard.httpUtils.HttpRecupererNotes;
import com.example.koboard.httpUtils.HttpRecupererUtilisateurs;
import com.example.koboard.model.Note;
import com.example.koboard.model.Utilisateur;
import com.example.koboard.services.RefreshService;

import java.util.ArrayList;

public class KonoteFragment extends Fragment {

    private KonoteViewModel konoteViewModel;
    private ArrayList<Note> listNoteFragment;
    private ArrayList<Utilisateur> listUtilisateurFragment;
    private KonoteAdaptaterListView adaptaterListView;
    private ListView listViewNote;
    private Intent refreshService;

    @RequiresApi(api = Build.VERSION_CODES.O)
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        refreshService = new Intent(getActivity(), RefreshService.class);
        getActivity().startService(refreshService);

        konoteViewModel =
                ViewModelProviders.of(this).get(KonoteViewModel.class);
        View root = inflater.inflate(R.layout.fragment_konote, container, false);

        listViewNote = root.findViewById(R.id.lv_note);
        final ImageButton btn_refresh_note = root.findViewById(R.id.btn_refresh_note);
        new HttpRecupererNotes(new HttpRecupererNotes.AsyncResponse() {
            @Override
            public void processFinish(final ArrayList<Note> listNote) {
                new HttpRecupererUtilisateurs(new HttpRecupererUtilisateurs.AsyncResponse() {
                    @Override
                    public void processFinish(ArrayList<Utilisateur> listUtilisateur) {
                        listUtilisateurFragment = listUtilisateur;
                        listNoteFragment = listNote;
                        adaptaterListView = new KonoteAdaptaterListView(getContext(), R.layout.element_note_list, listNoteFragment, listUtilisateurFragment);
                        listViewNote.setAdapter(adaptaterListView);

                        btn_refresh_note.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                refresh(true);
                            }
                        });
                    }
                }, getContext(), true).execute();
            }
        }, getContext(), true).execute();

        listViewNote.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Note noteSelectionne = (Note) listViewNote.getItemAtPosition(position);
                NavHostFragment navHostFragment = (NavHostFragment) getActivity().getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment);
                NavController navController = navHostFragment.getNavController();
                Bundle bundle = new Bundle();
                bundle.putBoolean("modification", true);
                bundle.putSerializable("note", noteSelectionne);
                bundle.putSerializable("utilisateurs", listUtilisateurFragment);
                navController.navigate(R.id.action_nav_konote_to_nav_konote_detail, bundle);
            }
        });

        final ImageButton buttonAddNote = root.findViewById(R.id.btn_ajouter_note);
        buttonAddNote.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Fragment newFragment = new KonoteFragmentDetailNote();
                NavHostFragment navHostFragment = (NavHostFragment) getActivity().getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment);
                NavController navController = navHostFragment.getNavController();
                Bundle bundle = new Bundle();
                bundle.putBoolean("modification", false);
                bundle.putSerializable("utilisateurs", listUtilisateurFragment);
                navController.navigate(R.id.action_nav_konote_to_nav_konote_detail, bundle);
            }
        });

        EditText et_recherche = root.findViewById(R.id.et_recherche);

        et_recherche.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                adaptaterListView.getFilter().filter(s);
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });

        return root;
    }

    @Override
    public void onResume() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(RefreshService.BROADCAST_ACTION);
        getContext().registerReceiver(myBroadcastReceiver, filter);
        super.onResume();
    }

    @Override
    public void onPause() {
        getContext().unregisterReceiver(myBroadcastReceiver);
        getActivity().stopService(refreshService);
        super.onPause();
    }

    private void refresh(final boolean loadingScreen) {
        new HttpRecupererNotes(new HttpRecupererNotes.AsyncResponse() {
            @Override
            public void processFinish(final ArrayList<Note> listNote) {
                new HttpRecupererUtilisateurs(new HttpRecupererUtilisateurs.AsyncResponse() {
                    @Override
                    public void processFinish(ArrayList<Utilisateur> listUtilisateur) {
                        listUtilisateurFragment = listUtilisateur;
                        listNoteFragment = listNote;
                        adaptaterListView = new KonoteAdaptaterListView(getContext(), R.layout.element_note_list, listNoteFragment, listUtilisateurFragment);
                        listViewNote.setAdapter(adaptaterListView);
                    }
                }, getContext(), loadingScreen).execute();
            }
        }, getContext(), loadingScreen).execute();
    }

    private BroadcastReceiver myBroadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            refresh(false);
        }
    };
}