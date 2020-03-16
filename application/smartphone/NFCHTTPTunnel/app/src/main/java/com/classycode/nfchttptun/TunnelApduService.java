package com.classycode.nfchttptun;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.Tag;
import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.widget.Toast;

import org.bouncycastle.util.encoders.Hex;
import org.web3j.abi.datatypes.Int;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.ECDSASignature;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.Hash;
import org.web3j.crypto.Sign;
import org.web3j.crypto.WalletUtils;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Bytes;
import org.web3j.utils.Numeric;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.security.SignatureException;
import java.util.Arrays;
import java.util.Base64;

/**
 * @author Alex Suzuki, Classy Code GmbH, 2017
 */
public class TunnelApduService extends HostApduService {

    public static final String BROADCAST_INTENT_LINK_ESTABLISHED = "LINK_ESTABLISHED";
    public static final String BROADCAST_INTENT_PROGRESS_UPDATED = "PROGRESS_UPDATED";
    public static final String BROADCAST_INTENT_DATA_RECEIVED = "DATA_RECEIVED";
    public static final String BROADCAST_INTENT_DATA_SENT = "DATA_SENT";
    public static final String BROADCAST_INTENT_LINK_DEACTIVATED = "LINK_DEACTIVATED";

    private static final String TAG = Constants.LOG_TAG;

    // the response sent from the phone if it does not understand an APDU
    private static final byte[] UNKNOWN_COMMAND_RESPONSE = {(byte) 0xff};

    // the SELECT AID APDU issued by the terminal
    // our AID is 0xF0ABCDEF0000
    private static final byte[] SELECT_AID_COMMAND = {
            (byte) 0x00, // Class
            (byte) 0xA4, // Instruction
            (byte) 0x04, // Parameter 1
            (byte) 0x00, // Parameter 2
            (byte) 0x06, // length
            (byte) 0xF0,
            (byte) 0xAB,
            (byte) 0xCD,
            (byte) 0xEF,
            (byte) 0x00,
            (byte) 0x00
    };

    // OK status sent in response to SELECT AID command (0x9000)
    private static final byte[] SELECT_RESPONSE_OK = {(byte) 0x90, (byte) 0x00};

    // Custom protocol commands issued by terminal
    private static final byte PAYMENT_HASH = (byte) 0x01;
    private static final byte TIMESTAMP_START = (byte) 0x02;
    private static final byte TIMESTAMP_END = (byte) 0x03;
    private static final byte UNITS = (byte) 0x04;
    private static final byte USAGE_FEE = (byte) 0x05;
    private static final byte DEVICE = (byte) 0x06;
    private static final byte ADDRESS_REQUEST = (byte) 0x07;

    private static final byte SIGNATURE_REQUEST = (byte) 0x00;

    // Custom protocol responses by phone
    private static final byte DATA_RESPONSE_OK = (byte) 0x00;
    private static final byte DATA_RESPONSE_NOK = (byte) 0x01;

    private boolean isProcessing;

    private String paymentHash = "";
    private String timestampStart = "";
    private String timestampEnd = "";
    private String units = "";
    private String usageFee = "";
    private String device = "";
    private String signature = "";


    private String privateKey = "0xF1AAB763D40CB301BD17966EB96250C37A0716A1E88DE64CB60BA183F64A480A";
    private String contractAddress = "0x7d17DA28604A7bB2E121D634012C086A6BbF6E2e";
    private Credentials credentials;


    @Override
    public void onCreate() {
        super.onCreate();
        isProcessing = false;
        if(!WalletUtils.isValidPrivateKey(this.privateKey)) {
            Log.e(TAG, "Private Key invalid");
        } else {
            Log.i(TAG, "Private Key valid");
            this.credentials =  Credentials.create(this.privateKey);
        }
    }

    public static String print(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        sb.append("[ ");
        for (byte b : bytes) {
            sb.append(String.format("0x%02X ", b));
        }
        sb.append("]");
        return sb.toString();
    }

    @Override
    public byte[] processCommandApdu(byte[] commandApdu, Bundle extras) {

        if (!isProcessing) {
            isProcessing = true;
        }

        if (Arrays.equals(SELECT_AID_COMMAND, commandApdu)) {
            Log.i(TAG, "Link established");
            notifyLinkEstablished();
            return SELECT_RESPONSE_OK;
        }
        else if (commandApdu[0] == PAYMENT_HASH) {
            Log.i(TAG, "-----------------------------------------------------------------------");
            byte[] paymentHashBytes = Arrays.copyOfRange(commandApdu, 1, commandApdu.length - 1);
            this.paymentHash = new String(paymentHashBytes);
            Log.i(TAG, "Received Payment Hash: " + paymentHash);
            Log.i(TAG, "Received Payment Hash: " + Arrays.toString(paymentHashBytes));
            Log.i(TAG, "Received Payment Hash: " + print(paymentHashBytes));

            Log.i(TAG, "-----------------------------------------------------------------------");
            return new byte[]{DATA_RESPONSE_OK};
        } else if (commandApdu[0] == TIMESTAMP_START) {
            Log.i(TAG, "-----------------------------------------------------------------------");
            byte[] timestampStartBytes = Arrays.copyOfRange(commandApdu, 1, commandApdu.length - 1);
            this.timestampStart = new String(timestampStartBytes);
            Log.i(TAG, "Received Timestamp Start: " + timestampStart);
            Log.i(TAG, "-----------------------------------------------------------------------");
            return new byte[]{DATA_RESPONSE_OK};
        } else if (commandApdu[0] == TIMESTAMP_END) {
            Log.i(TAG, "-----------------------------------------------------------------------");
            byte[] timestampEndBytes = Arrays.copyOfRange(commandApdu, 1, commandApdu.length - 1);
            this.timestampEnd = new String(timestampEndBytes);
            Log.i(TAG, "Received Timestamp End: " + timestampEnd);
            Log.i(TAG, "-----------------------------------------------------------------------");
            return new byte[]{DATA_RESPONSE_OK};
        } else if (commandApdu[0] == UNITS) {
            Log.i(TAG, "-----------------------------------------------------------------------");
            byte[] unitsBytes = Arrays.copyOfRange(commandApdu, 1, commandApdu.length - 1);
            this.units = new String(unitsBytes);
            Log.i(TAG, "Received units: " + units);
            Log.i(TAG, "-----------------------------------------------------------------------");
            return new byte[]{DATA_RESPONSE_OK};
        } else if (commandApdu[0] == USAGE_FEE) {
            Log.i(TAG, "-----------------------------------------------------------------------");
            byte[] usageFeeBytes = Arrays.copyOfRange(commandApdu, 1, commandApdu.length - 1);
            this.usageFee = new String(usageFeeBytes);
            Log.i(TAG, "Received Usage Fee: " + usageFee);
            Log.i(TAG, "-----------------------------------------------------------------------");
            return new byte[]{DATA_RESPONSE_OK};
        } else if (commandApdu[0] == DEVICE) {
            Log.i(TAG, "-----------------------------------------------------------------------");
            byte[] deviceBytes = Arrays.copyOfRange(commandApdu, 1, commandApdu.length - 1);
            this.device = new String(deviceBytes);
            Log.i(TAG, "Received Device: " + device);
            Log.i(TAG, "-----------------------------------------------------------------------");
            return new byte[]{DATA_RESPONSE_OK};
        } else if (commandApdu[0] == ADDRESS_REQUEST) {
            Log.i(TAG,"Address: " + this.credentials.getAddress());
            return this.credentials.getAddress().getBytes(StandardCharsets.UTF_8);
        } else if (commandApdu[0] == SIGNATURE_REQUEST) {

            Log.i(TAG,this.paymentHash);
            Log.i(TAG,this.timestampStart);
            Log.i(TAG,this.timestampEnd);
            Log.i(TAG,this.units);
            Log.i(TAG,this.usageFee);
            Log.i(TAG,this.device);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            try {
                baos.write(Hex.decode(this.contractAddress.substring(2)));
                baos.write(stringTo32ByteHex(this.timestampStart));
                baos.write(stringTo32ByteHex(this.timestampEnd));
                baos.write(stringTo32ByteHex(this.units));
                baos.write(stringTo32ByteHex(this.usageFee));
                baos.write(Hex.decode(this.device.substring(2)));
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
            try {
                //Bug!!! signedMessageToKey hashes internally another time. So data is double-hashed and recovered pubkey is wrong.
                BigInteger key = Sign.signedMessageToKey(finalHash, signatureData);
                Log.i(TAG, "Recovered: " + Hex.toHexString(key.toByteArray()));
                Log.i(TAG, "Pubkey: " + Hex.toHexString(this.credentials.getEcKeyPair().getPublicKey().toByteArray()));
            } catch (SignatureException e) {
                e.printStackTrace();
            }
            ByteArrayOutputStream output = new ByteArrayOutputStream();

            try {
                output.write(signatureData.getR());
                output.write(signatureData.getS());
                output.write(signatureData.getV());
            } catch (IOException e) {
                e.printStackTrace();
            }

            byte[] result = output.toByteArray();

            Log.i(TAG, "########SIGNATURE: " + Hex.toHexString(result));

/*            try {
                int header = signatureData.getV() & 0xFF;
                ECDSASignature sig = new ECDSASignature(
                        new BigInteger(1, signatureData.getR()),
                        new BigInteger(1, signatureData.getS()));

                int recId = header - 27;
                BigInteger recovered = Sign.recoverFromSignature(recId, sig, result);
                if(recovered != null) {
                    Log.i(TAG, "Recovered: " + Hex.toHexString(recovered.toByteArray()));
                    Log.i(TAG, "Pubkey: " + Hex.toHexString(this.credentials.getEcKeyPair().getPublicKey().toByteArray()));
                }
            } catch (Exception e) {
                Log.i(TAG, e.getMessage());
            }*/

            notifyPaymentSigned();
            return result;
            //return new byte[]{DATA_RESPONSE_OK};
        } else {

            Log.e(TAG, "Terminal sent unknown command: " + HexEncoder.convertByteArrayToHexString(commandApdu));
            return UNKNOWN_COMMAND_RESPONSE;
        }
    }

    public byte[] stringTo32ByteHex(String data) {
        //String hex = Integer.toHexString(Integer.parseUnsignedInt(data));
        String hex = Long.toHexString(Long.parseLong(data));
        String hexLeadingZeros = String.format ("%0"+ (64 - hex.length() )+"d%s", 0, hex);
        Log.i(TAG, hexLeadingZeros);
        return Hex.decode(hexLeadingZeros);
    }

    public static byte[] HexStringToByteArray(String s) {
        byte data[] = new byte[s.length()/2];
        for(int i=0;i < s.length();i+=2) {
            data[i/2] = (Integer.decode("0x"+s.charAt(i)+s.charAt(i+1))).byteValue();
        }
        return data;
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

    @Override
    public void onDeactivated(int reason) {
        Log.d(TAG, "Link deactivated: " + reason);

        isProcessing = false;
        notifyLinkDeactivated(reason);
    }

    private void notifyLinkEstablished() {
        Vibrator v = (Vibrator) getApplicationContext().getSystemService(Context.VIBRATOR_SERVICE);
        v.vibrate(VibrationEffect.createOneShot(200,100));

        LocalBroadcastManager.getInstance(getApplicationContext()).sendBroadcast(new Intent(BROADCAST_INTENT_LINK_ESTABLISHED));
    }

    private void notifyPaymentSigned() {
        Intent intent = new Intent(BROADCAST_INTENT_DATA_RECEIVED);
        intent.putExtra("timestampStart", this.timestampStart);
        intent.putExtra("timestampEnd", this.timestampEnd);
        intent.putExtra("usageFee", this.usageFee);
        intent.putExtra("units", this.units);
        LocalBroadcastManager.getInstance(getApplicationContext()).sendBroadcast(intent);
    }

    private void notifyLinkDeactivated(int reason) {
        Intent intent = new Intent(BROADCAST_INTENT_LINK_DEACTIVATED);
        intent.putExtra("reason", reason);
        LocalBroadcastManager.getInstance(getApplicationContext()).sendBroadcast(intent);
    }

}
