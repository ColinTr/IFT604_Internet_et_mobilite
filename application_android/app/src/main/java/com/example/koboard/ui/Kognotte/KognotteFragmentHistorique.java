package com.example.koboard.ui.Kognotte;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import com.example.koboard.R;
import com.example.koboard.httpUtils.HttpRecupererSoldes;
import com.example.koboard.httpUtils.HttpRecupererTransaction;
import com.example.koboard.httpUtils.HttpRecupererUtilisateurs;
import com.example.koboard.model.Solde;
import com.example.koboard.model.Transaction;
import com.example.koboard.model.Utilisateur;
import com.example.koboard.services.RefreshService;

import java.util.ArrayList;

public class KognotteFragmentHistorique extends Fragment {

    private ArrayList<Transaction> listTransactionFragment;
    private ArrayList<Utilisateur> listUtilisateursFragment;
    private Intent refreshService;
    private ListView listView;

    @RequiresApi(api = Build.VERSION_CODES.O)
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        refreshService = new Intent(getActivity(), RefreshService.class);
        getActivity().startService(refreshService);
        View root = inflater.inflate(R.layout.fragment_kognotte_historique, container, false);
        listView = root.findViewById(R.id.lv_cagnotte_historique);

        new HttpRecupererTransaction(new HttpRecupererTransaction.AsyncResponse() {
            @Override
            public void processFinish(final ArrayList<Transaction> listTransactions) {
                new HttpRecupererUtilisateurs(new HttpRecupererUtilisateurs.AsyncResponse() {
                    @Override
                    public void processFinish(ArrayList<Utilisateur> listUtilisateur) {
                        listTransactionFragment = listTransactions;
                        listUtilisateursFragment = listUtilisateur;
                        KognotteHistoriqueDepenseAdaptater adaptater = new KognotteHistoriqueDepenseAdaptater(getContext(), R.layout.element_historique_depense_list, listTransactionFragment, listUtilisateursFragment);
                        listView.setAdapter(adaptater);
                    }
                }, getContext(), true).execute();
            }
        }, getContext(),true).execute();

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
        new HttpRecupererTransaction(new HttpRecupererTransaction.AsyncResponse() {
            @Override
            public void processFinish(final ArrayList<Transaction> listTransactions) {
                new HttpRecupererUtilisateurs(new HttpRecupererUtilisateurs.AsyncResponse() {
                    @Override
                    public void processFinish(ArrayList<Utilisateur> listUtilisateur) {
                        listTransactionFragment = listTransactions;
                        listUtilisateursFragment = listUtilisateur;
                        KognotteHistoriqueDepenseAdaptater adaptater = new KognotteHistoriqueDepenseAdaptater(getContext(), R.layout.element_historique_depense_list, listTransactionFragment, listUtilisateursFragment);
                        listView.setAdapter(adaptater);
                    }
                }, getContext(), loadingScreen).execute();
            }
        }, getContext(),loadingScreen).execute();
    }

    private BroadcastReceiver myBroadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            refresh(false);
        }
    };
}
