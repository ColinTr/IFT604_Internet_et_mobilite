package com.example.koboard.ui.Kochat;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class KochatViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public KochatViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is Kochat fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}