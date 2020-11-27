package com.example.koboard.ui.Koulette;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.ViewModelProviders;
import com.adefruandta.spinningwheel.SpinningWheelView;
import com.example.koboard.R;
import com.example.koboard.ui.Kognotte.CreateDepenseDialogFragment;

import java.util.ArrayList;

public class KouletteFragment extends Fragment {

    private KouletteViewModel kouletteViewModel;
    private ArrayList<String> itemsWheel;
    private SpinningWheelView wheelView;

    @RequiresApi(api = Build.VERSION_CODES.O)
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        kouletteViewModel =
                ViewModelProviders.of(this).get(KouletteViewModel.class);
        View root = inflater.inflate(R.layout.fragment_koulette, container, false);

        wheelView = root.findViewById(R.id.wheel);

        // Can be array string or list of object
        itemsWheel = new ArrayList<>();
        itemsWheel.add("Item1");
        itemsWheel.add("Item2");
        itemsWheel.add("Item3");
        wheelView.setItems(itemsWheel);

        Button btn_button_items = root.findViewById(R.id.btn_button_items);
        btn_button_items.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FragmentManager fragmentManager = getActivity().getSupportFragmentManager();
                ItemsManageDialogFragment newFragment = new ItemsManageDialogFragment(wheelView, itemsWheel);
                newFragment.show(fragmentManager, "dialog");
            }
        });

        wheelView.setEnabled(false);
        Button btn_spin = root.findViewById(R.id.btn_spin);
        btn_spin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                wheelView.rotate(50, 7000, 50);
            }
        });

        wheelView.setOnRotationListener(new SpinningWheelView.OnRotationListener() {
            @Override
            public void onRotation() {

            }

            @Override
            public void onStopRotation(Object item) {
                String winner = (String)item;
                new androidx.appcompat.app.AlertDialog.Builder(getContext())
                        .setMessage(winner + " a gagné !")
                        .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                // Continue with delete operation
                            }
                        })
                        .show();
            }
        });

        return root;
    }
}