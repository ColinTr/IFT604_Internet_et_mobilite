package com.example.koboard.httpUtils;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.example.koboard.GlobalClass;
import com.example.koboard.model.Utilisateur;
import com.example.koboard.LoadingDialog;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.util.LinkedHashMap;
import java.util.Map;

public class HttpLogin   extends AsyncTask<Void, Void, Boolean> {

    private String ID_GOOGLE;
    private boolean error;
    private LoadingDialog loadingDialog;

    public HttpLogin.AsyncResponse delegate;

    public interface AsyncResponse {
        void processFinish(boolean error);
    }

    @Override
    protected void onPostExecute(Boolean error) {
        super.onPostExecute(error);
        loadingDialog.dismissDialog();
        delegate.processFinish(error);
    }

    public HttpLogin(String ID_GOOGLE, HttpLogin.AsyncResponse delegate, Context context) {
        this.error = false;
        this.ID_GOOGLE = ID_GOOGLE;
        this.delegate = delegate;
        this.loadingDialog = new LoadingDialog((Activity) context);
        loadingDialog.startLoadingDialog();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected Boolean doInBackground(Void... params) {
        try {
            //Connect to the server
            HttpURLConnection connection = HttpUtils.getConnection("/login?code=" + ID_GOOGLE, "GET");
            connection.setInstanceFollowRedirects(false);
            connection.connect();
            int responseCode = connection.getResponseCode();
            if(responseCode == 302) {
                String location = connection.getHeaderField("Location");
                URL url = new URL(location);
                Map<String, String> allQuery = splitQuery(url);
                String access_token = allQuery.get("tokens").split(",")[0].split(":")[1].replaceAll("\"", "");
                String expire_date = allQuery.get("tokens").substring(allQuery.get("tokens").indexOf("expiry_date")+13,allQuery.get("tokens").length()-1);
                GlobalClass.setToken(access_token);
                GlobalClass.setExpireDateToken(expire_date);
                Utilisateur utilisateur = GlobalClass.getUser();
                utilisateur.setId(allQuery.get("userid"));
                utilisateur.setUsername(allQuery.get("email").split("@")[0].substring(1));
                GlobalClass.setUser(utilisateur);
            }

            String result = HttpUtils.InputStreamToString(connection.getInputStream());
        } catch (IOException e) {
            error = true;
            System.out.println(e.getMessage());
        }

        return error;
    }

    public static Map<String, String> splitQuery(URL url) throws UnsupportedEncodingException {
        Map<String, String> query_pairs = new LinkedHashMap<String, String>();
        String query = url.getQuery();
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
        }
        return query_pairs;
    }
}
