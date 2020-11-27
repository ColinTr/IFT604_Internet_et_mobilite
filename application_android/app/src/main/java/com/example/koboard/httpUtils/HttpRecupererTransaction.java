package com.example.koboard.httpUtils;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.example.koboard.GlobalClass;
import com.example.koboard.model.Transaction;
import com.example.koboard.LoadingDialog;

import org.json.JSONArray;
import org.json.JSONObject;

import java.net.HttpURLConnection;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

public class HttpRecupererTransaction  extends AsyncTask<Void, Void, ArrayList<Transaction>> {

    public HttpRecupererTransaction.AsyncResponse delegate;
    private LoadingDialog loadingDialog;
    private boolean loaddingScreenActivate;

    public interface AsyncResponse {
        void processFinish(ArrayList<Transaction> listTransactions);
    }

    public HttpRecupererTransaction(HttpRecupererTransaction.AsyncResponse delegate, Context context, boolean loaddingScreenActivate) {
        this.loaddingScreenActivate = loaddingScreenActivate;
        this.delegate = delegate;
        if(loaddingScreenActivate) {
            this.loadingDialog = new LoadingDialog((Activity) context);
            loadingDialog.startLoadingDialog();
        }
    }

    @Override
    protected void onPostExecute(ArrayList<Transaction> listTransactions) {
        super.onPostExecute(listTransactions);
        if(loaddingScreenActivate) {
            loadingDialog.dismissDialog();
        }
        delegate.processFinish(listTransactions);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected ArrayList<Transaction> doInBackground(Void... params) {
        ArrayList<Transaction> listTransaction = new ArrayList<>();
        try {
            //Connect to the server
            HttpURLConnection connection = HttpUtils.getConnection("/kognotte/transactions", "GET");
            connection.setRequestProperty("Authorization", "Bearer " + GlobalClass.getToken());
            connection.connect();

            //get the list from the input stream
            String result = HttpUtils.InputStreamToString(connection.getInputStream());
            JSONArray array = new JSONArray(result);

            listTransaction = getInfo(array);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listTransaction;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    protected ArrayList<Transaction> getInfo(JSONArray array) {
        ArrayList<Transaction> listTransaction = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        try {
            for (int i = 0; i < array.length(); i++) {
                JSONObject object = new JSONObject(array.getString(i));

                String id = object.getString("_id");
                String idDashboard = object.getString("_dashboard");
                String from = object.getString("from");
                Double montant = object.getDouble("montant");
                String objet = object.getString("object");
                LocalDate date = LocalDate.parse(object.getString("date"), formatter);

                JSONArray toArray = object.getJSONArray("to");

                ArrayList<String> to = getUtilisateur(toArray);

                Transaction transaction = new Transaction(id, idDashboard, from, montant, to, objet, date);

                listTransaction.add(transaction);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return listTransaction;
    }

    private ArrayList<String> getUtilisateur(JSONArray listUser) {
        ArrayList<String> listUtilisateur = new ArrayList<>();
        try {
            for(int i = 0; i < listUser.length(); i++) {
                listUtilisateur.add(listUser.getString(i));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return listUtilisateur;
    }

}
