package com.example.koboard.ui.Koulette;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class KouletteViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public KouletteViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is Koulette fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}