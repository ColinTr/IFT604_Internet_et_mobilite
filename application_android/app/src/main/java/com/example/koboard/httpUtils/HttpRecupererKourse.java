package com.example.koboard.httpUtils;

import android.app.Activity;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.example.koboard.GlobalClass;
import com.example.koboard.model.ListKourse;
import com.example.koboard.model.Product;
import com.example.koboard.LoadingDialog;

import org.json.JSONArray;
import org.json.JSONObject;

import java.net.HttpURLConnection;
import java.util.ArrayList;

public class HttpRecupererKourse extends AsyncTask<Void, Void, ArrayList<ListKourse>> {

    public HttpRecupererKourse.AsyncResponse delegate;
    private LoadingDialog loadingDialog;

    public interface AsyncResponse {
        void processFinish(ArrayList<ListKourse> listKourses);
    }

    public HttpRecupererKourse(HttpRecupererKourse.AsyncResponse delegate, Context context) {
        this.delegate = delegate;
        this.loadingDialog = new LoadingDialog((Activity) context);
        loadingDialog.startLoadingDialog();
    }

    @Override
    protected void onPostExecute(ArrayList<ListKourse> listKourses) {
        super.onPostExecute(listKourses);
        loadingDialog.dismissDialog();
        delegate.processFinish(listKourses);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected ArrayList<ListKourse> doInBackground(Void... params) {
        ArrayList<ListKourse> listKourses = new ArrayList<ListKourse>();
        try {
            //Connect to the server
            HttpURLConnection connection = HttpUtils.getConnection("/kourses", "GET");
            connection.setRequestProperty("Authorization", "Bearer " + GlobalClass.getToken());
            connection.connect();

            //get the list from the input stream
            String result = HttpUtils.InputStreamToString(connection.getInputStream());
            JSONArray array = new JSONArray(result);

            listKourses = getInfo(array);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listKourses;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    protected ArrayList<ListKourse> getInfo(JSONArray array) {
        ArrayList<ListKourse> listKourses = new ArrayList<ListKourse>();
        try {
            for (int i = 0; i < array.length(); i++) {
                JSONObject object = new JSONObject(array.getString(i));

                String id_kourse = object.getString("_id");
                String idDashboard = object.getString("_dashboard");
                String titre = object.getString("title");

                JSONArray elements = object.getJSONArray("elements");

                ArrayList<Product> products = new ArrayList<Product>();
                for (int j = 0; j < elements.length(); j++) {
                    JSONObject object1 = new JSONObject(elements.getString(j));

                    String id = object1.getString("_id");
                    String content = object1.getString("content");
                    Boolean isBought = object1.getBoolean("bought");

                    Product product = new Product(id, content, isBought);
                    products.add(product);
                }

                ListKourse kourse = new ListKourse(id_kourse, idDashboard, titre, products);

                listKourses.add(kourse);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return listKourses;
    }

}
