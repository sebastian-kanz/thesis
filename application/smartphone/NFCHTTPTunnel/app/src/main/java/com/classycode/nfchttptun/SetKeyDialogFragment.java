package com.classycode.nfchttptun;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;



public class SetKeyDialogFragment extends DialogFragment {

    private static final String TAG = Constants.LOG_TAG;

    public interface SetKeyDialogListener {

        void onSetKeyDialogSucceeded(String key);

        void onSetKeyDialogCancelled();
    }

    private SetKeyDialogListener listener;

    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        final LayoutInflater inflater = getActivity().getLayoutInflater();
        final AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        final View contentView = inflater.inflate(R.layout.dialog_set_key, null);
        final EditText privKeyField = (EditText) contentView.findViewById(R.id.privKey_field);
        privKeyField.setText("0xF1AAB763D40CB301BD17966EB96250C37A0716A1E88DE64CB60BA183F64A480A");
        builder.setView(contentView)
                .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {

                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        final String privKey = privKeyField.getText().toString();
                        try {
                            listener.onSetKeyDialogSucceeded(privKey);
                        } catch (Exception e) {
                            Log.e(TAG,  e.getMessage());
                        }
                    }
                })
                .setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {

                    @Override
                    public void onClick(DialogInterface dialog, int id) {

                        listener.onSetKeyDialogCancelled();
                    }
                });
        // Create the AlertDialog object and return it
        return builder.create();
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        listener = (SetKeyDialogListener) context;
    }

}
