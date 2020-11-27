package com.example.koboard.ui.Konote;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class KonoteViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public KonoteViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is Konote fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}