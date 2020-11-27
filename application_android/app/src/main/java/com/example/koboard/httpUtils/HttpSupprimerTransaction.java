package com.example.koboard.httpUtils;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;
import androidx.annotation.RequiresApi;
import com.example.koboard.GlobalClass;
import com.example.koboard.model.Transaction;
import com.example.koboard.LoadingDialog;

import java.io.IOException;
import java.net.HttpURLConnection;

public class HttpSupprimerTransaction  extends AsyncTask<Void, Void, Boolean> {

    private Transaction transaction;
    public HttpSupprimerTransaction.AsyncResponse delegate;
    private boolean error;
    private LoadingDialog loadingDialog;

    public interface AsyncResponse {
        void processFinish(boolean error);
    }

    public HttpSupprimerTransaction(Transaction transaction, HttpSupprimerTransaction.AsyncResponse delegate, Context context) {
        this.transaction = transaction;
        this.delegate = delegate;
        this.error = false;
        this.loadingDialog = new LoadingDialog((Activity) context);
        loadingDialog.startLoadingDialog();
    }

    @Override
    protected void onPostExecute(Boolean error) {
        super.onPostExecute(error);
        loadingDialog.dismissDialog();
        delegate.processFinish(error);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected Boolean doInBackground(Void... params) {
        try {
            //Connect to the server
            HttpURLConnection connection = HttpUtils.getConnection("/kognotte/" + transaction.getId(), "DELETE");
            connection.setRequestProperty("Authorization", "Bearer " + GlobalClass.getToken());

            String result = HttpUtils.InputStreamToString(connection.getInputStream());

        } catch (IOException e) {
            error = true;
            System.out.println(e.getMessage());
        }

        return error;
    }

}
