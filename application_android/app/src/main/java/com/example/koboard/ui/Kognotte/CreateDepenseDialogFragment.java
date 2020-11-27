package com.example.koboard.ui.Kognotte;

import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Build;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.fragment.app.DialogFragment;
import com.example.koboard.R;
import com.example.koboard.httpUtils.HttpCreerTransaction;
import com.example.koboard.model.Transaction;
import com.example.koboard.model.Utilisateur;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Locale;

public class CreateDepenseDialogFragment extends DialogFragment {

    private ArrayList<Utilisateur> listUtilisateur;
    private Transaction transactionActuelle;

    public CreateDepenseDialogFragment (ArrayList<Utilisateur> listUtilisateur) {
        super();
        this.listUtilisateur = listUtilisateur;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.create_depense_dialog, container, false);

        final Calendar myCalendar = Calendar.getInstance();
        final EditText et_date_depense= root.findViewById(R.id.et_date_depense);
        String myFormat = "dd/MM/yyyy"; //In which you need put here
        final SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.FRANCE);
        et_date_depense.setText(sdf.format(myCalendar.getTime()));

        final DatePickerDialog.OnDateSetListener date = new DatePickerDialog.OnDateSetListener() {

            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear,
                                  int dayOfMonth) {
                myCalendar.set(Calendar.YEAR, year);
                myCalendar.set(Calendar.MONTH, monthOfYear);
                myCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);
                et_date_depense.setText(sdf.format(myCalendar.getTime()));
            }
        };

        et_date_depense.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new DatePickerDialog(getContext(), date, myCalendar
                        .get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                        myCalendar.get(Calendar.DAY_OF_MONTH)).show();
            }
        });

        final Button btn_annuler= root.findViewById(R.id.btn_annuler);
        btn_annuler.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        final Spinner sp_paye_par = root.findViewById(R.id.sp_paye_par);
        ArrayAdapter<Utilisateur> adapterSpinner = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, listUtilisateur);
        sp_paye_par.setAdapter(adapterSpinner);

        final CheckBox cb_checkAllUser = root.findViewById(R.id.cb_checkAllUser);

        final CreateDepenseAdaptaterList adaptaterList = new CreateDepenseAdaptaterList(getContext(), R.layout.element_create_depense_list, listUtilisateur, cb_checkAllUser);
        ListView listView = root.findViewById(R.id.lv_listeParticipant);
        listView.setAdapter(adaptaterList);





        final EditText et_montant = root.findViewById(R.id.et_montant);

        et_montant.addTextChangedListener(new TextWatcher() {

            @Override
            public void afterTextChanged(Editable s) {}

            @Override
            public void beforeTextChanged(CharSequence s, int start,
                                          int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start,
                                      int before, int count) {
                if(s.length() != 0) {
                    adaptaterList.setMontant(Double.parseDouble(et_montant.getText().toString()));
                    adaptaterList.notifyDataSetChanged();
                }
            }
        });

        cb_checkAllUser.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {

            @Override
            public void onCheckedChanged(CompoundButton buttonView,
                                         boolean isChecked) {
                if (cb_checkAllUser.isChecked()) {
                    adaptaterList.check_all_status = 1;
                    adaptaterList.setIdUtilisateursSelected(getAllIdUtilisateur());
                    adaptaterList.notifyDataSetChanged();
                } else {
                    adaptaterList.check_all_status = 0;
                    adaptaterList.getUtilisateursSelected().clear();
                    adaptaterList.notifyDataSetChanged();
                }
            }
        });

        final TextView et_object_depense = root.findViewById(R.id.et_object_depense);

        final Button btn_ajouter= root.findViewById(R.id.btn_ajouter);
        btn_ajouter.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void onClick(View v) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                transactionActuelle = new Transaction("", "", ((Utilisateur)sp_paye_par.getSelectedItem()).getId(), Double.valueOf(et_montant.getText().toString()), adaptaterList.getUtilisateursSelected(), et_object_depense.getText().toString(), LocalDate.parse(et_date_depense.getText().toString(),formatter));
                new HttpCreerTransaction(transactionActuelle, new HttpCreerTransaction.AsyncResponse() {
                    @Override
                    public void processFinish(boolean error) {
                        if(error) {
                            AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
                            builder.setMessage("Une erreur est survenue dans la communication avec le serveur")
                                    .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                                        public void onClick(DialogInterface dialog, int id) {
                                        }
                                    }).setTitle("Erreur");
                            builder.create();
                            builder.show();
                        }
                        else {
                            dismiss();
                        }
                    }
                }, getContext()).execute();
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

    public ArrayList<String> getAllIdUtilisateur() {
        ArrayList<String> allIds = new ArrayList<>();
        for(Utilisateur utilisateur : listUtilisateur) {
            allIds.add(utilisateur.getId());
        }
        return allIds;
    }
}
