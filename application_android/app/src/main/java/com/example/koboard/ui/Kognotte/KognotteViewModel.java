package com.example.koboard.ui.Kognotte;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class KognotteViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public KognotteViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is Kognotte fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}