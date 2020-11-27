package com.example.koboard.ui.Koulette;

import android.app.Dialog;
import android.content.DialogInterface;
import android.media.Image;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import androidx.fragment.app.DialogFragment;

import com.adefruandta.spinningwheel.SpinningWheelView;
import com.example.koboard.R;

import java.util.ArrayList;

public class ItemsManageDialogFragment extends DialogFragment {

    private ArrayList<String> listItems;
    private ListView lv_listItems;
    private ListAdapter adapter;
    private SpinningWheelView wheelView;

    public ItemsManageDialogFragment(SpinningWheelView wheelView, ArrayList<String> listItems) {
        this.wheelView = wheelView;
        this.listItems = listItems;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.items_manage_dialog, container, false);

        lv_listItems = root.findViewById(R.id.lv_listItems);
        adapter = new ListAdapter(getContext(), R.layout.element_koulette_list , listItems, wheelView);
        lv_listItems.setAdapter(adapter);

        ImageButton btn_quit_dialog = root.findViewById(R.id.btn_quit_dialog);
        btn_quit_dialog.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });
        final EditText et_item_to_add = root.findViewById(R.id.et_item_to_add);
        ImageButton btn_add_item = root.findViewById(R.id.btn_add_item);
        btn_add_item.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!et_item_to_add.getText().toString().equals("")) {
                    listItems.add(et_item_to_add.getText().toString());
                    adapter.notifyDataSetChanged();
                    wheelView.setItems(listItems);
                    et_item_to_add.setText("");
                }
            }
        });

        return root;
    }

    /** The system calls this only when creating the layout in a dialog. */
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        final Dialog dialog = super.onCreateDialog(savedInstanceState);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        return dialog;
    }
}
