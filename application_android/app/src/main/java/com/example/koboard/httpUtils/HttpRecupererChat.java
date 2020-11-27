package com.example.koboard.httpUtils;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.example.koboard.GlobalClass;
import com.example.koboard.model.Message;
import com.example.koboard.LoadingDialog;

import org.json.JSONArray;
import org.json.JSONObject;

import java.net.HttpURLConnection;
import java.util.ArrayList;

public class HttpRecupererChat extends AsyncTask<Void, Void, ArrayList<Message>> {

    public HttpRecupererChat.AsyncResponse delegate;
    private LoadingDialog loadingDialog;

    public interface AsyncResponse {
        void processFinish(ArrayList<Message> messages);
    }

    public HttpRecupererChat(HttpRecupererChat.AsyncResponse delegate, Context context) {
        this.delegate = delegate;
        this.loadingDialog = new LoadingDialog((Activity) context);
        loadingDialog.startLoadingDialog();
    }

    @Override
    protected void onPostExecute(ArrayList<Message> messages) {
        super.onPostExecute(messages);
        loadingDialog.dismissDialog();
        delegate.processFinish(messages);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected ArrayList<Message> doInBackground(Void... params) {
        ArrayList<Message> messages = new ArrayList<>();
        try {
            //Connect to the server
            HttpURLConnection connection = HttpUtils.getConnection("/kochat", "GET");
            connection.setRequestProperty("Authorization", "Bearer " + GlobalClass.getToken());
            connection.connect();

            //get the list from the input stream
            String result = HttpUtils.InputStreamToString(connection.getInputStream());
            JSONArray array = new JSONArray(result);

            messages = getInfo(array);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return messages;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    protected ArrayList<Message> getInfo(JSONArray array) {
        ArrayList<Message> messages = new ArrayList<>();
        try {
            for (int i = 0; i < array.length(); i++) {
                JSONObject object = new JSONObject(array.getString(i));

                String message = object.getString("content");
                String user = object.getString("author");

                Message msg = new Message(0,message, user);

                messages.add(msg);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return messages;
    }

}
