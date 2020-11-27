package com.example.koboard.ui.Koulette;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.adefruandta.spinningwheel.SpinningWheelView;
import com.example.koboard.R;

import java.util.ArrayList;

public class ListAdapter extends ArrayAdapter<String> {

    private Context mContext;
    int mRessource;
    private ListAdapter that = this;
    private ArrayList<String> listItem;
    private SpinningWheelView wheelView;

    public ListAdapter(@NonNull Context context, int resource, @NonNull ArrayList<String> objects, SpinningWheelView wheelView) {
        super(context, resource, objects);
        this.mContext = context;
        this.mRessource = resource;
        this.listItem = objects;
        this.wheelView = wheelView;
    }

    @SuppressLint("ViewHolder")
    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        final String item = getItem(position);

        LayoutInflater inflater = LayoutInflater.from(mContext);
        convertView = inflater.inflate(mRessource, parent, false);

        TextView tv_item = convertView.findViewById(R.id.tv_item);
        tv_item.setText(item);

        ImageButton btn_suppr_item = convertView.findViewById(R.id.btn_suppr_item);
        btn_suppr_item.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                listItem.remove(item);
                that.notifyDataSetChanged();
                wheelView.setItems(listItem);
            }
        });

        return convertView;

    }
}
