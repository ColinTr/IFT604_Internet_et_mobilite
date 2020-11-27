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

public class CreateProductDialogFragment extends DialogFragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState){
        View root = inflater.inflate(R.layout.create_element_dialog_kourse, container, false);

        final EditText name = root.findViewById(R.id.name);

        final Button btn_annuler = root.findViewById(R.id.btn_annuler2);
        btn_annuler.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        final Button btn_ajouter = root.findViewById(R.id.btn_ajouter2);
        btn_ajouter.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                //Vérifier la rentrée d'information pour la quantité
                KourseViewModel viewModel = KourseFragment.kourseViewModel;
                viewModel.createProduct(KourseFragment.id_listKourse, name.getText().toString());
                dismiss();
            }
        });

        return root;
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
