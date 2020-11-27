package com.example.koboard.httpUtils;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.example.koboard.GlobalClass;
import com.example.koboard.model.ListKourse;
import com.example.koboard.model.Product;
import com.example.koboard.LoadingDialog;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;

public class HttpModifierKourse extends AsyncTask<Void, Void, Boolean> {

    private ListKourse listKourse;
    private boolean error;
    private LoadingDialog loadingDialog;

    public HttpModifierKourse.AsyncResponse delegate;

    public interface AsyncResponse {
        void processFinish(boolean error);
    }

    @Override
    protected void onPostExecute(Boolean error) {
        super.onPostExecute(error);
        loadingDialog.dismissDialog();
        delegate.processFinish(error);
    }

    public HttpModifierKourse(ListKourse listKourse, HttpModifierKourse.AsyncResponse delegate, Context context) {
        this.error = false;
        this.listKourse = listKourse;
        this.delegate = delegate;
        this.loadingDialog = new LoadingDialog((Activity) context);
        loadingDialog.startLoadingDialog();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected Boolean doInBackground(Void... params) {
        try {
            //Creation du contenu JSON
            JSONObject jsonParam = new JSONObject();
            jsonParam.put("_dashboard", listKourse.getDashboard());
            jsonParam.put("title", listKourse.getTitle());

            JSONArray elements = new JSONArray();
            for(Product product : listKourse.getProducts()) {
                JSONObject prod = new JSONObject();
                prod.put("content",product.getProductName());
                prod.put("bought", product.isChecked());
                elements.put(prod);
            }
            jsonParam.put("elements", elements);
            String data = jsonParam.toString();
            // Initialisation de notre connexion
            HttpURLConnection urlConnection = HttpUtils.getConnection("/kourses/" + listKourse.getId(), "PUT");
            urlConnection.setRequestProperty("Authorization", "Bearer " + GlobalClass.getToken());
            urlConnection.setRequestProperty("content-type", "application/json");
            urlConnection.setDoInput(true);
            urlConnection.setDoOutput(true);
            OutputStream out = new BufferedOutputStream(urlConnection.getOutputStream());
            urlConnection.connect();

            // Envoie de nos données
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"));
            writer.write(data);
            writer.flush();
            writer.close();
            out.close();

            try {
                //Récupération de la réponse du serveur
                InputStream in = new BufferedInputStream(urlConnection.getInputStream());
                BufferedReader reader = new BufferedReader(new InputStreamReader(in));
                StringBuilder result = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    result.append(line);
                }

                Log.d("test", "result from server: " + result.toString());
                error = false;

            } catch (IOException e) {
                error = true;
                e.printStackTrace();
            } finally {
                if (urlConnection != null) {
                    urlConnection.disconnect();
                }
            }

        } catch (IOException | JSONException e) {
            error = true;
            System.out.println(e.getMessage());
        }

        return error;
    }

}
