package com.classycode.nfchttptun;

import android.os.AsyncTask;
import android.util.Log;

import org.bouncycastle.util.encoders.Hex;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tuples.generated.Tuple3;
import org.web3j.tuples.generated.Tuple4;
import org.web3j.tuples.generated.Tuple6;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Convert;

import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

class ReceiveBlockchainDataTask extends AsyncTask<String, Void, Tuple3<String, String, Tuple4<List<BigInteger>, List<BigInteger>,List<BigInteger>, List<BigInteger>>>> {

    private Exception exception;
    private String TAG = "ReceiveBlockchainDataTask";

    protected Tuple3<String, String, Tuple4<List<BigInteger>, List<BigInteger>,List<BigInteger>, List<BigInteger>>> doInBackground(String... urls) {
        Web3j web3j = Web3j.build(new HttpService("https://kovan.infura.io/v3/cd8cc67ea2c34b49ac1d9e52b6b3de2b"));
        String privateKey = "0xF1AAB763D40CB301BD17966EB96250C37A0716A1E88DE64CB60BA183F64A480A";
        Credentials credentials =  Credentials.create(privateKey);
        String contractAddress = "0x7d17DA28604A7bB2E121D634012C086A6BbF6E2e";

        DefaultGasProvider gasProvider = new DefaultGasProvider();

        PaymentProvider contract = PaymentProvider.load(contractAddress, web3j, credentials, gasProvider);
        try {

            BigInteger balance = contract.getBalance(Hex.decode("d8c82608d7353429872ad6f6f0ec529e5a1d37b2041bdbec91d1f63288c72708")).send();
            String balanceETHPayment = Convert.fromWei(balance.toString(), Convert.Unit.ETHER).toString();

            EthGetBalance ethGetBalance = web3j.ethGetBalance(credentials.getAddress(), DefaultBlockParameterName.LATEST).sendAsync().get();
            String balanceETHTotal = Convert.fromWei(ethGetBalance.getBalance().toString(), Convert.Unit.ETHER).toString();

            //0xd8c82608d7353429872ad6f6f0ec529e5a1d37b2041bdbec91d1f63288c72708
            Tuple4<List<BigInteger>, List<BigInteger>,List<BigInteger>, List<BigInteger>> history = contract.getPaymentHistory(Hex.decode("d8c82608d7353429872ad6f6f0ec529e5a1d37b2041bdbec91d1f63288c72708")).send();

            Tuple3<String, String, Tuple4<List<BigInteger>, List<BigInteger>,List<BigInteger>, List<BigInteger>>> data = new Tuple3<String, String, Tuple4<List<BigInteger>, List<BigInteger>,List<BigInteger>, List<BigInteger>>>(balanceETHPayment, balanceETHTotal, history);
            return data;
        } catch (IOException e) {
            this.exception = e;
            e.printStackTrace();
            return null;
        } catch (Exception e) {
            Log.e(TAG, "Error: " + e.getMessage());
            Log.e(TAG, "Error: " + e.toString());
            return null;
        }
    }

    protected void onPostExecute(Tuple3<String, String, Tuple4<List<BigInteger>, List<BigInteger>,List<BigInteger>, List<BigInteger>>> returnValue) {
        // TODO: check this.exception
        // TODO: do something with the feed
    }
}