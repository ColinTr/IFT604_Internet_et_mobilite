package com.example.koboard;

import android.app.Activity;
import android.app.AlertDialog;
import android.view.LayoutInflater;

import com.example.koboard.R;

public class LoadingDialog {

    Activity activity;
    AlertDialog dialog;

    public LoadingDialog(Activity myActivity) {
        this.activity = myActivity;
    }

    public void startLoadingDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);

        LayoutInflater inflater = activity.getLayoutInflater();
        builder.setView(inflater.inflate(R.layout.loading_dialog, null));
        builder.setCancelable(false);

        dialog = builder.create();
        dialog.show();
    }

    public void dismissDialog() {
        dialog.dismiss();
    }
}