package com.example.koboard.ui.Kourse;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;

import com.example.koboard.R;
import com.example.koboard.model.Product;
import com.example.koboard.ui.Kotemps.KotempsFragment;

import java.util.ArrayList;

public class KourseAdapterList extends ArrayAdapter<Product> {

    private Context mContext;
    int mRessources;
    private String id;
    private FragmentActivity activity;
    private KourseAdapterList object=this;
    private ArrayList<Product> objects;

    public KourseAdapterList(@NonNull Context context, int resource, @NonNull ArrayList<Product> objects, @NonNull FragmentActivity activity){
        super(context, resource, objects);
        this.mContext = context;
        this.mRessources = resource;
        this.activity = activity;
        this.objects = objects;
    }

    public void setListe(ArrayList<Product> objects){
        this.objects = objects;
    }

    @NonNull
    @Override
    public View getView(final int position, @Nullable View convertView, @NonNull ViewGroup parent){
        try {
            String productName = objects.get(position).getProductName();
            id = objects.get(position).getId();
            boolean isChecked2 = objects.get(position).isChecked();

            LayoutInflater inflater = LayoutInflater.from(mContext);
            convertView = inflater.inflate(mRessources, parent, false);

            CheckBox isTaken = convertView.findViewById(R.id.is_taken);
            TextView name = convertView.findViewById(R.id.nom_produit);
            ImageButton deleteButton = convertView.findViewById(R.id.delete);
            ImageButton modifyButton = convertView.findViewById(R.id.modify2);

            name.setText(productName);

            isTaken.setChecked(isChecked2);

            isTaken.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                    KourseViewModel.checkProduct(KourseFragment.id_listKourse, id, isChecked);
                }
            });

            modifyButton.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    showDialog();
                    KourseFragment.update();
                    KourseFragment.adapterList = new KourseAdapterList(getContext(), R.layout.element_list_kourse, KourseFragment.productList, activity);
                    ((ListView)KourseFragment.root.findViewById(R.id.lv_kourse)).setAdapter(KourseFragment.adapterList);
                }
            });

            deleteButton.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                    KourseViewModel.deleteProduct(KourseFragment.id_listKourse, id);
                    KourseFragment.update();
                    KourseFragment.adapterList = new KourseAdapterList(getContext(), R.layout.element_list_kourse, KourseFragment.productList, activity);
                    ((ListView)KourseFragment.root.findViewById(R.id.lv_kourse)).setAdapter(KourseFragment.adapterList);
                }
            });
        }
        catch (Exception e){

        }
        return convertView;
    }

    public void showDialog() {
        FragmentManager fragmentManager = activity.getSupportFragmentManager();
        ModifyProductDialogFragment newFragment = new ModifyProductDialogFragment();
        newFragment.setId(id);
        newFragment.show(fragmentManager, "dialog");
    }

}
