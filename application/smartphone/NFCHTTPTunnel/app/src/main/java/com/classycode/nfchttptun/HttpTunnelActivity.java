package com.classycode.nfchttptun;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NfcAdapter;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.bouncycastle.util.encoders.Hex;
import org.w3c.dom.Text;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.Hash;
import org.web3j.crypto.Sign;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tuples.generated.Tuple3;
import org.web3j.tuples.generated.Tuple4;
import org.web3j.tx.ChainId;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Bytes;
import org.web3j.utils.Convert;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * @author Alex Suzuki, Classy Code GmbH, 2017
 */
public class HttpTunnelActivity extends AppCompatActivity implements SetKeyDialogFragment.SetKeyDialogListener {

    private static final String TAG = Constants.LOG_TAG;

    private TextView statusLabel;
    private TextView vContentStart;
    private TextView vContentEnd;
    private TextView vContentUnits;
    private TextView vContentFee;
    private TextView vContentTotal;
    private Button bSolidity;
    private TextView vBalancePayment;
    private TextView vBalanceTotal;
    private ListView lHistory;
    private LocalBroadcastManager lbm;
    private boolean dataReceived;

    private String[] history = {"empty"};;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_http_tunnel);

        statusLabel = (TextView) findViewById(R.id.status_label);
        vContentStart = (TextView) findViewById(R.id.vContentStart);
        vContentEnd = (TextView) findViewById(R.id.vContentEnd);
        vContentUnits = (TextView) findViewById(R.id.vContentUnits);
        vContentFee = (TextView) findViewById(R.id.vContentFee);
        vContentTotal = (TextView) findViewById(R.id.vContentTotal);
        setSupportActionBar((Toolbar) findViewById(R.id.toolbar));
        bSolidity = (Button) findViewById(R.id.bSolidity);
        vBalancePayment = (TextView) findViewById(R.id.vBalancePayment);
        vBalanceTotal = (TextView) findViewById(R.id.vBalanceTotal);
        lHistory = (ListView) findViewById(R.id.lHistory);


        ArrayAdapter adapter = new ArrayAdapter<String>(this,R.layout.history_listview,history);
        lHistory.setAdapter(adapter);

        bSolidity.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                updateEth();
            }
        });


        lbm = LocalBroadcastManager.getInstance(this);
        updateEth();
       /* ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            baos.write(stringTo32ByteHex("1583938660"));
            baos.write(stringTo32ByteHex("1583938663"));
            baos.write(stringTo32ByteHex("1"));
            baos.write(stringTo32ByteHex("10"));
            baos.write(Hex.decode("f00C699c96E05f919EE1C57B824a29cC6216352E"));
            //solidity encodepacked result:
            //0x000000000000000000000000000000000000000000000000000000005e68fc64000000000000000000000000000000000000000000000000000000005e68fc670000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000af00c699c96e05f919ee1c57b824a29cc6216352e
        } catch (IOException e) {
            e.printStackTrace();
        }
        byte[] d = baos.toByteArray();
        Log.i(TAG, "########BYTES: " + Hex.toHexString(d));
        byte[] hash = Hash.sha3(d);
        Log.i(TAG, "########HASH: " + Hex.toHexString(hash));
        byte[] finalHash = getEthereumMessageHash(hash);
        Log.i(TAG, "########FINAL HASH: " + Hex.toHexString(finalHash));
        Credentials credentials = Credentials.create("0xF1AAB763D40CB301BD17966EB96250C37A0716A1E88DE64CB60BA183F64A480A");
        Log.i(TAG, "########ADDRESS: " + credentials.getAddress());

        Sign.SignatureData signatureData = Sign.signMessage(finalHash, credentials.getEcKeyPair(),false);
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        try {
            output.write(signatureData.getR());
            output.write(signatureData.getS());
            output.write(signatureData.getV());
        } catch (IOException e) {
            e.printStackTrace();
        }

        byte[] result = output.toByteArray();

        Log.i(TAG, "########SIGNATURE: " + Hex.toHexString(result));*/

    }

    private void updateEth() {
        try {
            Tuple3<String, String, Tuple4<List<BigInteger>, List<BigInteger>,List<BigInteger>, List<BigInteger>>> data = new ReceiveBlockchainDataTask().execute("test123").get();

            String balanceETHPayment = data.component1();
            String balanceETHTotal = data.component2();
            vBalancePayment.setText(String.format("%.2f",Float.valueOf(balanceETHPayment)) + " ETH (" + String.format("%.2f",Float.valueOf(balanceETHPayment) * 196.04) + "€)");
            vBalanceTotal.setText(String.format("%.2f",Float.valueOf(balanceETHTotal)) + " ETH (" + String.format("%.2f",Float.valueOf(balanceETHTotal) * 196.04) + "€)");

            Tuple4<List<BigInteger>, List<BigInteger>,List<BigInteger>, List<BigInteger>> newHistory = data.component3();
            List<BigInteger> timestampsStart = newHistory.component1();
            List<BigInteger> timestampsEnd = newHistory.component2();
            List<BigInteger> units = newHistory.component3();
            List<BigInteger> costs = newHistory.component4();

            ArrayList<String> tmp = new ArrayList<String>();

            if(units.size() == 0){
                tmp.add("empty");
            } else {
                for (int i = 0; i < units.size(); i++) {
                    Double total = Double.parseDouble(costs.get(i).toString()) * Double.parseDouble(units.get(i).toString());
                    String eth = Convert.fromWei(String.valueOf(total), Convert.Unit.ETHER).toString();
                    tmp.add(units.get(i).toString() + " Kaffee für " + String.format("%.3f",Float.valueOf(eth)) + " ETH (" + String.format("%.2f",Float.valueOf(eth) * 196.04) + "€)");
                }
            }


            ArrayAdapter adapter = new ArrayAdapter<String>(this,R.layout.history_listview,tmp);
            lHistory.setAdapter(adapter);


        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public byte[] getEthereumMessagePrefix(int messageLength) {
        String MESSAGE_PREFIX = "\u0019Ethereum Signed Message:\n";
        return MESSAGE_PREFIX.concat(String.valueOf(messageLength)).getBytes();
    }


    public byte[] getEthereumMessageHash(byte[] message) {
        byte[] prefix = getEthereumMessagePrefix(message.length);

        byte[] result = new byte[prefix.length + message.length];
        System.arraycopy(prefix, 0, result, 0, prefix.length);
        System.arraycopy(message, 0, result, prefix.length, message.length);

        return Hash.sha3(result);
    }

    public byte[] stringTo32ByteHex(String data) {
        String hex = Integer.toHexString(Integer.parseInt(data));
        String hexLeadingZeros = String.format ("%0"+ (64 - hex.length() )+"d%s", 0, hex);
        Log.i(TAG, hexLeadingZeros);
        return Hex.decode(hexLeadingZeros);
    }

    @Override
    protected void onResume() {
        super.onResume();

        checkForNFC();

        lbm.registerReceiver(linkEstablishedReceiver, new IntentFilter(TunnelApduService.BROADCAST_INTENT_LINK_ESTABLISHED));
        lbm.registerReceiver(dataSentReceiver, new IntentFilter(TunnelApduService.BROADCAST_INTENT_DATA_SENT));
        lbm.registerReceiver(dataReceivedReceiver, new IntentFilter(TunnelApduService.BROADCAST_INTENT_DATA_RECEIVED));
        lbm.registerReceiver(linkDeactivatedReceiver, new IntentFilter(TunnelApduService.BROADCAST_INTENT_LINK_DEACTIVATED));

        statusLabel.setText("Ready to receive data.");
    }

    @Override
    protected void onPause() {
        lbm.unregisterReceiver(linkEstablishedReceiver);
        lbm.unregisterReceiver(dataSentReceiver);
        lbm.unregisterReceiver(dataReceivedReceiver);
        lbm.unregisterReceiver(linkDeactivatedReceiver);

        super.onPause();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.action_set_url) {
            final SetKeyDialogFragment setKeyDialog = new SetKeyDialogFragment();
            setKeyDialog.show(getSupportFragmentManager(), null);
            return true;

        } else {
            return super.onOptionsItemSelected(item);
        }
    }

    private void checkForNFC() {
        NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(getApplicationContext());
        if (!nfcAdapter.isEnabled()) {
            final AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle(R.string.error_nfc_disabled_title);
            builder.setMessage(R.string.error_nfc_disabled_message);
            builder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    startActivity(new Intent(Settings.ACTION_NFC_SETTINGS));
                }
            });
            builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                }
            });
            builder.show();
        }
    }

    private BroadcastReceiver linkEstablishedReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            statusLabel.setText("NFC link established.");
            dataReceived = false;
        }
    };

    private BroadcastReceiver dataSentReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            statusLabel.setText("Data sent.");
        }
    };

    private BroadcastReceiver dataReceivedReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            dataReceived = true;
            String timestampStart = intent.getStringExtra("timestampStart");
            String timestampEnd = intent.getStringExtra("timestampEnd");
            String usageFee = intent.getStringExtra("usageFee");
            String units = intent.getStringExtra("units");
            statusLabel.setText("Data received.");
            vContentStart.setText(Date.from(Instant.ofEpochSecond(Integer.parseInt(timestampStart))).toString());
            vContentEnd.setText(Date.from(Instant.ofEpochSecond(Integer.parseInt(timestampEnd))).toString());
            vContentUnits.setText(units);
            Double ether = Double.parseDouble(usageFee) / Double.parseDouble("1000000000000000000");
            Double euro = 196.04 * ether;
            vContentFee.setText(ether.toString() + "ETH (" + String.format("%.2f", euro) + "€)");
            Double etherTotal = Double.parseDouble(units) * ether;
            Double euroTotal = 196.04 * etherTotal;
            vContentTotal.setText(etherTotal.toString() + "ETH (" + String.format("%.2f", euroTotal) + "€)");
            updateEth();
        }
    };

    private BroadcastReceiver linkDeactivatedReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (!dataReceived) { // link terminated before data was received
                statusLabel.setText("Link deactivated.");
            }

        }
    };

    @Override
    public void onSetKeyDialogSucceeded(String key) {

    }

    @Override
    public void onSetKeyDialogCancelled() {

    }
}
