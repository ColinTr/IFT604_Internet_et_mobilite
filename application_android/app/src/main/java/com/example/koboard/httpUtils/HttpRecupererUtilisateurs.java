package com.example.koboard.httpUtils;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.example.koboard.GlobalClass;
import com.example.koboard.model.Utilisateur;
import com.example.koboard.LoadingDialog;

import org.json.JSONArray;
import org.json.JSONObject;
import java.net.HttpURLConnection;
import java.util.ArrayList;

public class HttpRecupererUtilisateurs   extends AsyncTask<Void, Void, ArrayList<Utilisateur>> {

    public HttpRecupererUtilisateurs.AsyncResponse delegate;
    private LoadingDialog loadingDialog;
    private boolean loaddingScreenActivate;

    public interface AsyncResponse {
        void processFinish(ArrayList<Utilisateur> listUtilisateur);
    }

    public HttpRecupererUtilisateurs(HttpRecupererUtilisateurs.AsyncResponse delegate, Context context, boolean loaddingScreenActivate) {
        this.loaddingScreenActivate = loaddingScreenActivate;
        this.delegate = delegate;
        if(loaddingScreenActivate) {
            this.loadingDialog = new LoadingDialog((Activity) context);
            loadingDialog.startLoadingDialog();
        }
    }

    @Override
    protected void onPostExecute(ArrayList<Utilisateur> listUtilisateur) {
        super.onPostExecute(listUtilisateur);
        if(loaddingScreenActivate) {
            loadingDialog.dismissDialog();
        }
        delegate.processFinish(listUtilisateur);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected ArrayList<Utilisateur> doInBackground(Void... params) {
        ArrayList<Utilisateur> listUtilisateur = new ArrayList<>();
        try {
            //Connect to the server
            HttpURLConnection connection = HttpUtils.getConnection("/users", "GET");
            connection.setRequestProperty("Authorization", "Bearer " + GlobalClass.getToken());
            connection.connect();

            //get the list from the input stream
            String result = HttpUtils.InputStreamToString(connection.getInputStream());
            JSONArray array = new JSONArray(result);


            listUtilisateur = getInfo(array);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listUtilisateur;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    protected ArrayList<Utilisateur> getInfo(JSONArray array) {
        ArrayList<Utilisateur> listUtilisateur = new ArrayList<>();
        try {
            for (int i = 0; i < array.length(); i++) {
                JSONObject object = new JSONObject(array.getString(i));

                String id = object.getString("_id");
                String username = object.getString("username");

                Utilisateur utilisateur = new Utilisateur(id, username);

                listUtilisateur.add(utilisateur);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return listUtilisateur;
    }
}
