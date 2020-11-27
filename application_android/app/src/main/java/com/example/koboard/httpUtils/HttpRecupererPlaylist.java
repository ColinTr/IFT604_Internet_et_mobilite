package com.example.koboard.httpUtils;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.example.koboard.GlobalClass;
import com.example.koboard.LoadingDialog;
import com.example.koboard.model.Note;

import org.json.JSONArray;
import org.json.JSONObject;

import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;


public class HttpRecupererPlaylist  extends AsyncTask<Void, Void, String> {


    public HttpRecupererPlaylist.AsyncResponse delegate;
    private String countryCode;

    public interface AsyncResponse {
        void processFinish(String uriPlaylist);
    }

    public HttpRecupererPlaylist(HttpRecupererPlaylist.AsyncResponse delegate,String countryCode) {
        this.delegate = delegate;
        this.countryCode = countryCode;
    }

    @Override
    protected void onPostExecute(String uriPlaylist) {
        super.onPostExecute(uriPlaylist);
        delegate.processFinish(uriPlaylist);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected String doInBackground(Void... params) {
        String uriPlaylist = "";
        try {
            //Connect to the server
            URL myURL = new URL("https://api.spotify.com/v1/browse/categories/toplists/playlists?country=" + countryCode + "&limit=1");
            HttpURLConnection connection = (HttpURLConnection) myURL.openConnection();
            connection.setRequestMethod("GET");
            connection.setReadTimeout(HttpUtils.READ_TIMEOUT);
            connection.setConnectTimeout(HttpUtils.CONNECTION_TIMEOUT);
            connection.setRequestProperty("Authorization", "Bearer " + GlobalClass.SPOTIFY_AUTH_TOKEN);
            connection.connect();

            //get the list from the input stream
            String result = HttpUtils.InputStreamToString(connection.getInputStream());
            JSONObject array = new JSONObject(result);

            uriPlaylist = getInfo(array);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return uriPlaylist;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    protected String getInfo(JSONObject array) {
        String uriPlaylist = "";
        try {
            uriPlaylist = array.getJSONObject("playlists").getJSONArray("items").getJSONObject(0).getString("uri");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return uriPlaylist;
    }
}
