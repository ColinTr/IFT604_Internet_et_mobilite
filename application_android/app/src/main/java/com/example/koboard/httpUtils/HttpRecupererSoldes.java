package com.example.koboard.httpUtils;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;
import androidx.annotation.RequiresApi;
import com.example.koboard.GlobalClass;
import com.example.koboard.model.Solde;
import com.example.koboard.LoadingDialog;
import org.json.JSONArray;
import org.json.JSONObject;
import java.net.HttpURLConnection;
import java.util.ArrayList;

public class HttpRecupererSoldes extends AsyncTask<Void, Void, ArrayList<Solde>> {

    public HttpRecupererSoldes.AsyncResponse delegate;
    private LoadingDialog loadingDialog;
    private boolean loaddingScreenActivate;

    public interface AsyncResponse {
        void processFinish(ArrayList<Solde> listNote);
    }

    public HttpRecupererSoldes(HttpRecupererSoldes.AsyncResponse delegate, Context context, boolean loaddingScreenActivate) {
        this.loaddingScreenActivate = loaddingScreenActivate;
        this.delegate = delegate;
        if(loaddingScreenActivate) {
            this.loadingDialog = new LoadingDialog((Activity) context);
            loadingDialog.startLoadingDialog();
        }
    }

    @Override
    protected void onPostExecute(ArrayList<Solde> soldes) {
        super.onPostExecute(soldes);
        if(loaddingScreenActivate) {
            loadingDialog.dismissDialog();
        }
        delegate.processFinish(soldes);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected ArrayList<Solde> doInBackground(Void... params) {
        ArrayList<Solde> listSoldes = new ArrayList<>();
        try {
            //Connect to the server
            HttpURLConnection connection = HttpUtils.getConnection("/kognotte/soldes", "GET");
            connection.setRequestProperty("Authorization", "Bearer " + GlobalClass.getToken());
            connection.connect();

            //get the list from the input stream
            String result = HttpUtils.InputStreamToString(connection.getInputStream());
            JSONArray array = new JSONArray(result);

            listSoldes = getInfo(array);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listSoldes;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    protected ArrayList<Solde> getInfo(JSONArray array) {
        ArrayList<Solde> listSoldes = new ArrayList<>();
        try {
            for (int i = 0; i < array.length(); i++) {
                JSONObject object = new JSONObject(array.getString(i));

                String id_solde = object.getString("_id");
                String idDashboard = object.getString("_dashboard");
                String userId = object.getString("_user");
                Double montant = object.getDouble("value");

                Solde solde = new Solde(id_solde, idDashboard, userId, montant);

                listSoldes.add(solde);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return listSoldes;
    }
}
