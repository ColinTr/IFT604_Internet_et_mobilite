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
import org.json.JSONObject;

import java.net.HttpURLConnection;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

public class HttpRecupererNotes  extends AsyncTask<Void, Void, ArrayList<Note>> {

    public HttpRecupererNotes.AsyncResponse delegate;
    private LoadingDialog loadingDialog;
    private boolean loaddingScreenActivate;

    public interface AsyncResponse {
        void processFinish(ArrayList<Note> listNote);
    }

    public HttpRecupererNotes(HttpRecupererNotes.AsyncResponse delegate, Context context, boolean loaddingScreenActivate) {
        this.loaddingScreenActivate = loaddingScreenActivate;
        this.delegate = delegate;
        if(loaddingScreenActivate) {
            this.loadingDialog = new LoadingDialog((Activity) context);
            loadingDialog.startLoadingDialog();
        }
    }

    @Override
    protected void onPostExecute(ArrayList<Note> listNotes) {
        super.onPostExecute(listNotes);
        if(loaddingScreenActivate) {
            loadingDialog.dismissDialog();
        }
        delegate.processFinish(listNotes);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected ArrayList<Note> doInBackground(Void... params) {
        ArrayList<Note> listNotes = new ArrayList<>();
        try {
            //Connect to the server
            HttpURLConnection connection = HttpUtils.getConnection("/konotes", "GET");
            connection.setRequestProperty("Authorization", "Bearer " + GlobalClass.getToken());
            connection.connect();

            //get the list from the input stream
            String result = HttpUtils.InputStreamToString(connection.getInputStream());
            JSONArray array = new JSONArray(result);

            listNotes = getInfo(array);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listNotes;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    protected ArrayList<Note> getInfo(JSONArray array) {
        ArrayList<Note> listNotes = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        try {
            for (int i = 0; i < array.length(); i++) {
                JSONObject object = new JSONObject(array.getString(i));

                String id_note = object.getString("_id");
                String idDashboard = object.getString("_dashboard");
                String titre = object.getString("title");
                String content = object.getString("content");
                String idAuthor = object.getString("author");

                JSONArray taggedUsersJSON = object.getJSONArray("taggedUsers");

                ArrayList<String> taggedUsers = getUtilisateur(taggedUsersJSON);
                LocalDate date = LocalDate.parse(object.getString("date"), formatter);

                Note note = new Note(id_note,content,titre,idAuthor,taggedUsers,date);

                listNotes.add(note);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return listNotes;
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
