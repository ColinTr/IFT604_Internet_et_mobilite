package com.example.koboard.ui.Kourse;

import android.app.Dialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;

import androidx.fragment.app.DialogFragment;

import com.example.koboard.R;
import com.example.koboard.model.Product;

public class ModifyProductDialogFragment extends DialogFragment {

    private String id;
    private EditText name;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState){
        View root = inflater.inflate(R.layout.modify_element_dialog_kourse, container, false);

        final EditText name = root.findViewById(R.id.name2);

        Product prod = KourseViewModel.getProductById(KourseFragment.id_listKourse, id);
        name.setText(prod.getProductName());

        final Button btn_annuler = root.findViewById(R.id.btn_annuler3);
        btn_annuler.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        final Button btn_modifier = root.findViewById(R.id.btn_modifier);
        btn_modifier.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                //Vérifier la rentrée d'information pour la quantité
                KourseViewModel viewModel = KourseFragment.kourseViewModel;
                viewModel.modifyProduct(KourseFragment.id_listKourse, id, name.getText().toString());
                dismiss();
            }
        });

        return root;
    }

    public void setId(String id){
        this.id = id;
    }

    /** The system calls this only when creating the layout in a dialog. */
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        // The only reason you might override this method when using onCreateView() is
        // to modify any dialog characteristics. For example, the dialog includes a
        // title by default, but your custom layout might not need it. So here you can
        // remove the dialog title, but you must call the superclass to get the Dialog.
        final Dialog dialog = super.onCreateDialog(savedInstanceState);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        return dialog;
    }
}
