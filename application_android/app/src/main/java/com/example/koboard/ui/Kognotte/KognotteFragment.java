package com.example.koboard.ui.Kognotte;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.ViewModelProviders;
import androidx.navigation.NavController;
import androidx.navigation.NavDirections;
import androidx.navigation.fragment.NavHostFragment;

import com.example.koboard.R;
import com.example.koboard.httpUtils.HttpRecupererNotes;
import com.example.koboard.httpUtils.HttpRecupererSoldes;
import com.example.koboard.httpUtils.HttpRecupererUtilisateurs;
import com.example.koboard.model.Note;
import com.example.koboard.model.Participant;
import com.example.koboard.model.Solde;
import com.example.koboard.model.Utilisateur;
import com.example.koboard.services.RefreshService;
import com.example.koboard.ui.Konote.KonoteAdaptaterListView;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Locale;

public class KognotteFragment extends Fragment {

    private KognotteViewModel kognotteViewModel;
    private ArrayList<Utilisateur> listUtilisateurFragment;
    private ArrayList<Solde> listeSoldeFragment;
    private ListView listView;
    private KognotteAdaptaterList adaptaterList;
    private Intent refreshService;

    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        refreshService = new Intent(getActivity(), RefreshService.class);
        getActivity().startService(refreshService);

        kognotteViewModel = ViewModelProviders.of(this).get(KognotteViewModel.class);
        View root = inflater.inflate(R.layout.fragment_kognotte, container, false);

        listView = root.findViewById(R.id.lv_cagnotte);
        final Button buttonAjouterDepense = root.findViewById(R.id.btn_ajouter_depense);
        final ImageButton btn_refresh = root.findViewById(R.id.btn_refresh);
        new HttpRecupererSoldes(new HttpRecupererSoldes.AsyncResponse() {
            @Override
            public void processFinish(final ArrayList<Solde> listSoldes) {
                new HttpRecupererUtilisateurs(new HttpRecupererUtilisateurs.AsyncResponse() {
                    @Override
                    public void processFinish(ArrayList<Utilisateur> listUtilisateur) {
                        listUtilisateurFragment = listUtilisateur;
                        listeSoldeFragment = listSoldes;
                        listeSoldeFragment = clearList(listeSoldeFragment, listUtilisateurFragment);
                        adaptaterList = new KognotteAdaptaterList(getContext(), R.layout.element_green_list_kognotte, listeSoldeFragment, listUtilisateurFragment);
                        listView.setAdapter(adaptaterList);

                        buttonAjouterDepense.setOnClickListener(new View.OnClickListener() {
                            public void onClick(View v) {
                                FragmentManager fragmentManager = getActivity().getSupportFragmentManager();
                                CreateDepenseDialogFragment newFragment = new CreateDepenseDialogFragment(listUtilisateurFragment);
                                newFragment.show(fragmentManager, "dialog");
                            }
                        });
                        btn_refresh.setOnClickListener(new View.OnClickListener() {
                            public void onClick(View v) {
                                refresh(true);
                            }
                        });

                    }
                }, getContext(), true).execute();
            }
        }, getContext(), true).execute();

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Solde item = (Solde) listView.getItemAtPosition(position);
                NavHostFragment navHostFragment = (NavHostFragment) getActivity().getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment);
                NavController navController = navHostFragment.getNavController();
                Bundle bundle = new Bundle();
                bundle.putString("idUtilisateurActuel", item.getUserId());
                bundle.putSerializable("utilisateurs", listUtilisateurFragment);
                bundle.putSerializable("soldes", listeSoldeFragment);
                navController.navigate(R.id.action_nav_kognotte_to_nav_kognotte_detail_green2, bundle);
            }
        });

        final Button buttonHistorique = root.findViewById(R.id.btn_historique);
        buttonHistorique.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                NavHostFragment navHostFragment = (NavHostFragment) getActivity().getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment);
                NavController navController = navHostFragment.getNavController();
                Bundle bundle = new Bundle();
                navController.navigate(R.id.action_nav_kognotte_to_nav_kognotte_historique, bundle);
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

    public void refresh(final boolean loadingScreen) {
            new HttpRecupererSoldes(new HttpRecupererSoldes.AsyncResponse() {
                @Override
                public void processFinish(final ArrayList<Solde> listSoldes) {
                    new HttpRecupererUtilisateurs(new HttpRecupererUtilisateurs.AsyncResponse() {
                        @Override
                        public void processFinish(ArrayList<Utilisateur> listUtilisateur) {
                            listUtilisateurFragment = listUtilisateur;
                            listeSoldeFragment = listSoldes;
                            listeSoldeFragment = clearList(listeSoldeFragment, listUtilisateurFragment);
                            adaptaterList = new KognotteAdaptaterList(getContext(), R.layout.element_green_list_kognotte, listeSoldeFragment, listUtilisateurFragment);
                            listView.setAdapter(adaptaterList);
                            adaptaterList.notifyDataSetChanged();
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

    private ArrayList<Solde> clearList(ArrayList<Solde> listSoldeAvant, ArrayList<Utilisateur> listUtilisateur) {
        ArrayList<Solde> listSoldeCleared = new ArrayList<Solde>();

        for(Solde solde : listSoldeAvant) {
            for(Utilisateur utilisateur : listUtilisateur) {
                if(solde.getUserId().equals(utilisateur.getId())) {
                    listSoldeCleared.add(solde);
                }
            }
        }

        return listSoldeCleared;
    }
}