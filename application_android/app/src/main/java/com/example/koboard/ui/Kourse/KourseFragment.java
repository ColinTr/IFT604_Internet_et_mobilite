package com.example.koboard.ui.Kourse;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import com.example.koboard.R;
import com.example.koboard.httpUtils.HttpRecupererKourse;
import com.example.koboard.model.ListKourse;
import com.example.koboard.model.Product;

import java.util.ArrayList;

public class KourseFragment extends Fragment {

    public static KourseViewModel kourseViewModel;
    public static ArrayList<Product> productList;
    public static String id_listKourse;
    public static String titreListe;
    public static int compteur = 0 ;
    private TextView titre;
    public static KourseAdapterList adapterList;
    public static View root;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        kourseViewModel = ViewModelProviders.of(this).get(KourseViewModel.class);
        kourseViewModel.setContextActivity(getContext(), getActivity());
        root = inflater.inflate(R.layout.fragment_kourse, container, false);

        final ListView listView = root.findViewById(R.id.lv_kourse);

        new HttpRecupererKourse(new HttpRecupererKourse.AsyncResponse() {
            @Override
            public void processFinish(final ArrayList<ListKourse> listKourse) {
                kourseViewModel.listeKourses = listKourse;

                productList = kourseViewModel.listeKourses.get(0).getProducts();
                id_listKourse = kourseViewModel.listeKourses.get(0).getId();
                titreListe = kourseViewModel.listeKourses.get(0).getTitle();

                adapterList = new KourseAdapterList(getContext(), R.layout.element_list_kourse, productList, getActivity());
                listView.setAdapter(adapterList);
            }
        }, getContext()).execute();

        final Button addListButton = root.findViewById(R.id.add_liste_button);
        addListButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showDialog2();
                update();
                adapterList = new KourseAdapterList(getContext(), R.layout.element_list_kourse, productList, getActivity());
                listView.setAdapter(adapterList);
            }
        });

        titre = root.findViewById(R.id.title_liste);
        titre.setText(titreListe);

        final Button previousButton = root.findViewById(R.id.PreviousButton);
        previousButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(compteur != 0){
                    compteur --;
                    productList = kourseViewModel.listeKourses.get(compteur).getProducts();
                    id_listKourse = kourseViewModel.listeKourses.get(compteur).getId();
                    titreListe = kourseViewModel.listeKourses.get(compteur).getTitle();
                }
                titre.setText(titreListe);
                adapterList = new KourseAdapterList(getContext(), R.layout.element_list_kourse, productList, getActivity());
                listView.setAdapter(adapterList);
            }
        });

        final Button nextButton = root.findViewById(R.id.NextButton);
        nextButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(compteur != kourseViewModel.listeKourses.size()-1){
                    compteur ++;
                    productList = kourseViewModel.listeKourses.get(compteur).getProducts();
                    id_listKourse = kourseViewModel.listeKourses.get(compteur).getId();
                    titreListe = kourseViewModel.listeKourses.get(compteur).getTitle();
                }
                titre.setText(titreListe);
                adapterList = new KourseAdapterList(getContext(), R.layout.element_list_kourse, productList, getActivity());
                listView.setAdapter(adapterList);
            }
        });

        final ImageButton addProductButton = root.findViewById(R.id.add_button);
        addProductButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                showDialog();
                update();
                adapterList = new KourseAdapterList(getContext(), R.layout.element_list_kourse, productList, getActivity());
                listView.setAdapter(adapterList);
            }
        });

        return root;
    }

    public static void update(){
        kourseViewModel.getProductList();
        productList = kourseViewModel.listeKourses.get(compteur).getProducts();
        id_listKourse = kourseViewModel.listeKourses.get(compteur).getId();
        titreListe = kourseViewModel.listeKourses.get(compteur).getTitle();
    }

    public void showDialog() {
        FragmentManager fragmentManager = getActivity().getSupportFragmentManager();
        CreateProductDialogFragment newFragment = new CreateProductDialogFragment();
        newFragment.show(fragmentManager, "dialog");
    }

    public void showDialog2() {
        FragmentManager fragmentManager = getActivity().getSupportFragmentManager();
        CreateListDialogFragment newFragment = new CreateListDialogFragment();
        newFragment.show(fragmentManager, "dialog");
    }
}