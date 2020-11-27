package com.example.koboard.ui.Kochat;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.icu.text.SymbolTable;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;


import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.koboard.GlobalClass;
import com.example.koboard.R;
import com.example.koboard.httpUtils.HttpCreerNote;
import com.example.koboard.httpUtils.HttpEnvoyerMessage;
import com.example.koboard.httpUtils.HttpRecupererChat;
import com.example.koboard.httpUtils.HttpRecupererNotes;
import com.example.koboard.httpUtils.HttpRecupererUtilisateurs;
import com.example.koboard.model.Constants;
import com.example.koboard.model.Message;
import com.example.koboard.model.Note;
import com.example.koboard.model.Utilisateur;
import com.example.koboard.ui.Konote.KonoteAdaptaterListView;

import org.json.JSONException;
import org.json.JSONObject;

import io.socket.client.Socket;
import io.socket.emitter.Emitter;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

public class KochatFragment extends Fragment {

    private static final String TAG = "ChatAndroid";

    private KochatViewModel kochatViewModel;

    private RecyclerView view;
    private EditText editMessage;
    private List<Message> messages = new ArrayList<Message>();
    private List<Utilisateur> users = new ArrayList<Utilisateur>();
    private RecyclerView.Adapter adapter;
    private String user;
    private Socket socket;
    private boolean isConnected = true;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
       kochatViewModel =
                ViewModelProviders.of(this).get(KochatViewModel.class);
        View root = inflater.inflate(R.layout.fragment_kochat, container, false);
        view = root.findViewById(R.id.messages);

        new HttpRecupererChat(new HttpRecupererChat.AsyncResponse() {
            @Override
            public void processFinish(final ArrayList<Message> listMessage) {
                new HttpRecupererUtilisateurs(new HttpRecupererUtilisateurs.AsyncResponse() {
                    @Override
                    public void processFinish(ArrayList<Utilisateur> listUtilisateur) {
                        messages = listMessage;
                        users = listUtilisateur;
                        view.setLayoutManager(new LinearLayoutManager(getActivity()));
                        adapter = new MessageAdapter(getContext(), messages, users);
                        view.setAdapter(adapter);
                    }
                }, getContext(), true).execute();
            }
        }, getContext()).execute();

        GlobalClass app = (GlobalClass) getActivity().getApplication();
        socket = app.getSocket();

        //Ici je viendrai récupérer le vrai id d'utilisateur de la personne après l'authentification
        user = "5fbd7894f8cba2409c33c7a9";

        socket.on("message", onNewMessage);
        socket.connect();


        editMessage = root.findViewById(R.id.message_input);
        editMessage.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int id, KeyEvent event) {
                if (id == R.id.send || id == EditorInfo.IME_NULL) {
                    try {
                        attemptSend();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    return true;
                }
                return false;
            }
        });

        ImageButton sendButton = root.findViewById(R.id.send_button);
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    attemptSend();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });

        return root;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        socket.disconnect();
        socket.off("message", onNewMessage);
    }

    private void addMessage(String user, String message) {
        Message msg = new Message(Message.MESSAGE_TYPE, message, user);
        messages.add(msg);
        adapter.notifyItemInserted(messages.size() - 1);
        scrollToBottom();
    }

    private void attemptSend() throws JSONException {
        if (null == user) return;

        String message = editMessage.getText().toString().trim();

        if (TextUtils.isEmpty(message)) {
            editMessage.requestFocus();
            return;
        }

        Message msg = new Message(Message.MESSAGE_TYPE, message, user);

        new HttpEnvoyerMessage(msg, new HttpEnvoyerMessage.AsyncResponse() {
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
            }
        }, getContext()).execute();

        editMessage.setText("");
        addMessage(user, message);

        JSONObject data = new JSONObject();
        data.put("content", message);
        data.put("author", user);

        // perform the sending message attempt.
        socket.emit("message", data);
    }

    private void scrollToBottom() {
        view.scrollToPosition(adapter.getItemCount() - 1);
    }

    private Emitter.Listener onNewMessage = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String username;
                    String message;
                    try {
                        username = data.getString("author");
                        message = data.getString("content");
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }

                    addMessage(username, message);
                }
            });
        }
    };
}