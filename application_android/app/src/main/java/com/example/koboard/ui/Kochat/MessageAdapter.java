package com.example.koboard.ui.Kochat;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.koboard.R;
import com.example.koboard.model.Message;
import com.example.koboard.model.Utilisateur;

import java.util.List;

import okhttp3.internal.Util;

public class MessageAdapter extends RecyclerView.Adapter<MessageAdapter.ViewHolder> {

    private List<Message> messages;
    private List<Utilisateur> users;
    private int[] usernameColors;

    public MessageAdapter(Context context, List<Message> messages, List<Utilisateur> users) {
        this.messages = messages;
        this.usernameColors = context.getResources().getIntArray(R.array.username_colors);
        this.users = users;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        int layout = -1;
        switch (viewType) {
            case Message.MESSAGE_TYPE:
                layout = R.layout.item_message;
                break;
            case Message.LOG_TYPE:
                layout = R.layout.item_log;
                break;
        }
        View v = LayoutInflater
                .from(parent.getContext())
                .inflate(layout, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(ViewHolder viewHolder, int position) {
        Message message = messages.get(position);
        Utilisateur utilisateur = null;
        for(Utilisateur utilisateurBoucle : users) {
            if(utilisateurBoucle.getId().equals(message.getUser())) {
                utilisateur = utilisateurBoucle;
            }
        }
        viewHolder.setMessage(message.getMessage());
        viewHolder.setUsername(utilisateur.getUsername());
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    @Override
    public int getItemViewType(int position) {
        return messages.get(position).getType();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        private TextView userView;
        private TextView messageView;

        public ViewHolder(View itemView) {
            super(itemView);

            userView = itemView.findViewById(R.id.username);
            messageView = itemView.findViewById(R.id.message);
        }

        public void setUsername(String username) {
            if (null == userView) return;
            userView.setText(username);
            userView.setTextColor(getUsernameColor(username));
        }

        public void setMessage(String message) {
            if (null == messageView) return;
            messageView.setText(message);
        }

        private int getUsernameColor(String username) {
            int hash = 7;
            for (int i = 0, len = username.length(); i < len; i++) {
                hash = username.codePointAt(i) + (hash << 5) - hash;
            }
            int index = Math.abs(hash % usernameColors.length);
            return usernameColors[index];
        }
    }
}
