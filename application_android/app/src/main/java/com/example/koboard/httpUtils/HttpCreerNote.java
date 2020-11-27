package com.example.koboard.httpUtils;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.example.koboard.GlobalClass;
import com.example.koboard.model.Note;
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

public class HttpCreerNote  extends AsyncTask<Void, Void, Boolean> {

    private Note note;
    private boolean error;
    private LoadingDialog loadingDialog;

    public HttpCreerNote.AsyncResponse delegate;

    public interface AsyncResponse {
        void processFinish(boolean error);
    }

    @Override
    protected void onPostExecute(Boolean error) {
        super.onPostExecute(error);
        loadingDialog.dismissDialog();
        delegate.processFinish(error);
    }

    public HttpCreerNote(Note note, AsyncResponse delegate, Context context) {
        this.error = false;
        this.note = note;
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
            jsonParam.put("_dashboard", "5fbbd16a57e2c761e0ef574e");
            jsonParam.put("title", note.getTitre());
            jsonParam.put("content", note.getContent());
            jsonParam.put("author", GlobalClass.getUser().getId());
            JSONArray taggedUsers = new JSONArray();
            for(String idUser : note.getTaggedUsers()) {
                taggedUsers.put(idUser);
            }
            jsonParam.put("users", taggedUsers);
            String data = jsonParam.toString();

            // Initialisation de notre connexion
            HttpURLConnection urlConnection = HttpUtils.getConnection("/konotes", "POST");
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
