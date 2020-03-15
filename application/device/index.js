const fs = require('fs');
const Web3 = require('web3');
const utils = require('ethereumjs-util');
const { exec, spawn } = require("child_process");
const ipc = require('node-ipc');
const readline = require('readline');
// const PROVIDER = new web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/cd8cc67ea2c34b49ac1d9e52b6b3de2b");
const web3js = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/cd8cc67ea2c34b49ac1d9e52b6b3de2b"));

const Tx = require('ethereumjs-tx').Transaction;

const PAYMENTPROVIDER_CONTRACT_ABI =
[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			},
			{
				"internalType": "address payable",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_device",
				"type": "address"
			}
		],
		"name": "addPaymentAgreement",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "charge",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "empty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "getDevice",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "getPaymentHistory",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "getReceiver",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "getSender",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "paymentAgreements",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "device",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "numPayments",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_timestampStart",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_timestampEnd",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_units",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_cost",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			},
			{
				"internalType": "address",
				"name": "_device",
				"type": "address"
			}
		],
		"name": "redeem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "registerRentalProvider",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

var socketId = 'icp-test';
ipc.config.id   = 'hello';
ipc.config.socketRoot = '/tmp/';
ipc.config.appspace = '';
ipc.config.stopRetrying = true;
ipc.config.silent = true;
ipc.config.retry= 1500;

// execute C file for listening for nfc devices
// const cExecutable = exec("./device", (error, stdout, stderr) => console.log(stdout));

const convert = (from, to) => str => Buffer.from(str, from).toString(to);
const utf8ToHex = convert('utf8', 'hex');
const hexToUtf8 = convert('hex', 'utf8');

ipc.connectTo(
 socketId,
 function(){
   ipc.of[socketId].on(
     'connect',
     function(){
       console.log("Connected!!");
       // ipc.log('## connected to world ##'.rainbow, ipc.config.delay);
       // ipc.of[socketId].emit(
       //   'message',  //any event or message type your server listens for
       //   getPaymentToSign()
       // )
     }
   );
   ipc.of[socketId].on(
     'disconnect',
     function(){
       console.log("Disconnected!!");
       // ipc.log('disconnected from world'.notice);
     }
   );
   ipc.of[socketId].on(
     'message',  //any event or message type your server listens for
     function(data){
			 data.address = hexToUtf8(data.address);
			 // console.log(hexToUtf8(data.address));

       console.log("Message: " + JSON.stringify(data));

       backupPaymentData();
       const hash = getPaymentHash(data);
       const sig = utils.fromRpcSig("0x"+data.signature);
       if(!signatureIsValid(data.paymentHash, hash, sig)) {
         throw "Signature invald.";
       }
       writePaymentDataToJSONFile(data);

        console.log("Serving coffee....");
        console.log("");
        console.log("       ( (      ");
        console.log("        ) )     ");
        console.log("      ........  ");
        console.log("      |      |] ");
        console.log("      \\      /  ");
        console.log("       `----'   ");
        console.log("");
        console.log("... enjoy!");
     }
   );
 }
);


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async function(line){
    if(line === "coffee") {
      ipc.of[socketId].emit(
        'message',  //any event or message type your server listens for
        getPaymentToSign()
      );
    }
    if(line === "redeem") {
			try {
				console.log("Processing Transaction to Blockchain...");




				var myAddress = '0xe3CBf35cD6FadEA91C4b9A19882Af976725753dD';
				// var privateKey = Buffer.from('7948B42D530C006BA9394F84945E0A816ABE55720690182A29313A5FB026C78D', 'hex')
				var privateKey = "0x7948B42D530C006BA9394F84945E0A816ABE55720690182A29313A5FB026C78D";

        //contract abi is the array that you can get from the ethereum wallet or etherscan
        var contractABI = PAYMENTPROVIDER_CONTRACT_ABI;
        var contractAddress ="0x3BE0C37e881EA08D99e1acb017A68028e410B3Af";
        //creating contract object
        var contract = new web3js.eth.Contract(contractABI,contractAddress);
				var paymentJSON = readPaymentDataFromJSONFile();
				console.log(paymentJSON);
        var count;
        // get transaction count, later will used as nonce
        web3js.eth.getTransactionCount(myAddress).then(function(v){
            console.log("Count: "+v);
            count = v;
            //creating raw tranaction
            var rawTransaction = {
							"from": myAddress,
							"gasPrice": web3js.utils.toHex(58* 1e9),
							"gasLimit": web3js.utils.toHex(3000000),
							"to": contractAddress,
							"value": "0x0",
							"data": contract.methods.redeem(paymentJSON.paymentHash, paymentJSON.timestampStart, paymentJSON.timestampEnd, paymentJSON.units, paymentJSON.usageFee, "0x" + paymentJSON.signature, paymentJSON.device).encodeABI(),
							"nonce": web3js.utils.toHex(count)}
            console.log(rawTransaction);





						//sign Tx
						web3js.eth.accounts.signTransaction(rawTransaction, privateKey)
						    .then(RLPencodedTx => {
						      web3js.eth.sendSignedTransaction(RLPencodedTx['rawTransaction'])
									.on('transactionHash', (hash) => {
										console.log("Transaction-Hash: " + hash);
									})
									.on('receipt', (receipt) => {
										console.log("Receipt: " , receipt);
										paymentJSON.timestampStart = Math.floor(Date.now()/1000).toString();
  									paymentJSON.timestampEnd = "0";
  									paymentJSON.units = "0";
										paymentJSON.signature = "";
										writePaymentDataToJSONFile(paymentJSON);
									})
									.on('error', (error) => {
										console.log("Error: " + error);
									});
								});
        });

			} catch(err) {
				console.error(err);
			}
		}












	  //     const account = '0xe3CBf35cD6FadEA91C4b9A19882Af976725753dD' // Your account address 1
	  //     const privateKey = Buffer.from('7948B42D530C006BA9394F84945E0A816ABE55720690182A29313A5FB026C78D', 'hex');
	  //     const web3 = new Web3(PROVIDER);
	  //     const PAYMENTPROVIDER_CONTRACT_ADDR = '0x9082828B77EF13a170628aCaDD91D8187e1C1e2e';
	  //     let paymentProviderContract = new web3.eth.Contract(PAYMENTPROVIDER_CONTRACT_ABI, PAYMENTPROVIDER_CONTRACT_ADDR);
		// 		let paymentJSON = readPaymentDataFromJSONFile();
		// 		console.log(paymentJSON);
	  //     let myData = paymentProviderContract.methods.redeem(paymentJSON.paymentHash, paymentJSON.timestampStart, paymentJSON.timestampEnd, paymentJSON.units, paymentJSON.usageFee, "0x" + paymentJSON.signature, paymentJSON.device).encodeABI();
		// 		try {
		// 			web3.eth.getTransactionCount(account).then(nonce => {
		// 				 let rawTx = {
		// 					 nonce: web3.utils.toHex(nonce),
		// 					 gasLimit: web3.utils.toHex(3000000),
		// 					 gasPrice: web3.utils.toHex(10000000000), // 10-15 gwei should do it
		// 					 to: PAYMENTPROVIDER_CONTRACT_ADDR,
		// 					 value: "0x00",
		// 					 data: myData
		// 				 };
		//
		// 				 const transaction = new Tx(rawTx, { chain: "kovan" }); //transaction = new Tx(txData, {'chain':'rinkeby'});
		// 				 transaction.sign(Buffer.from(privateKey, "hex"));
		// 				 web3.eth
		// 					 .sendSignedTransaction("0x" + transaction.serialize().toString("hex"))
		// 					 .on("transactionHash", function(txHash) {
		// 						 console.log(txHash);
		// 					 })
		// 					 .on("receipt", function(receipt) {
		// 						 console.log("receipt:" + receipt);
		// 					 })
		// 					 .on("confirmation", function(confirmationNumber, receipt) {
		// 						 if (confirmationNumber >= 1) {
		// 							 console.log("confirmed.");
		// 						 }
		// 					 })
		// 					 .on("error", function(error) {
		// 						 console.log("error sending erc20 token", error);
		// 					 })
		// 					 .catch(console.error("error"));
		// 			}).catch(err => console.error(err));
		// 		} catch(err) {
		// 			console.log(err);
		// 		}
		// 	} catch(err) {
		// 		console.error(err);
		// 	}
		// }
	});




const signedPaymentFile = './signedPayment.json';


// TODO: init web3. call smart contract and check balance of payment channel
// save information to init.json in case of connection loss
// if init.json exists, load information (how many coffees were ordered yet?, how much money is left in the payment channel?)
// write function for periodically redeeming payment data, for testing purposes set interval to every second.
// write dummy function for making coffee

const backupPaymentData = async() => {
  let ts = Math.floor(Date.now()/1000);
  await fs.copyFile(signedPaymentFile, `./paymentHistory/${ts}.json`, (err) => {
    if (err) throw err;
  });
}

const writePaymentDataToJSONFile = (paymentJSON) => {
  try {
    let payment = JSON.stringify(paymentJSON);
    fs.writeFileSync(signedPaymentFile, payment);
  } catch (err) {
    console.error(err);
  }
}

const readPaymentDataFromJSONFile = () => {
  try {
    let rawdata = fs.readFileSync(signedPaymentFile);
    let signedPayment = JSON.parse(rawdata);
    return signedPayment;
  } catch (err) {
    console.error(err);
    return new Object();
  }
}

const getPaymentToSign = () => {
  try {
    let oldPayment = readPaymentDataFromJSONFile();
    let newUnsignedPayment = new Object();
    // TODO: edit data to new units and costs etc.
    newUnsignedPayment.paymentHash = oldPayment.paymentHash;
    newUnsignedPayment.timestampStart = oldPayment.timestampStart;
    newUnsignedPayment.timestampEnd = Math.round(new Date().getTime()/1000).toString();
    newUnsignedPayment.units = (parseInt(oldPayment.units) + 1).toString();
    newUnsignedPayment.usageFee = oldPayment.usageFee;
    newUnsignedPayment.device = oldPayment.device;
    return newUnsignedPayment;
  } catch (err) {
    console.error(err);
    return new Object();
  }
}

const getPaymentHash = (paymentJSON) => {
  try {
    let paymentHash = Buffer.from(paymentJSON.paymentHash);
    let timestampStart = Buffer.from(paymentJSON.timestampStart);
    let timestampEnd = Buffer.from(paymentJSON.timestampEnd);
    // let timestampEnd = Buffer.from(Math.round(new Date().getTime()/1000).toString());
    let units = Buffer.from(paymentJSON.units);
    // let units = Buffer.from((parseInt(signedPayment.units) + 1).toString());
    let cost = Buffer.from(paymentJSON.usageFee);
    let device = Buffer.from(paymentJSON.device);
    let arr = [paymentHash, timestampStart, timestampEnd, units, cost, device];
    let message = Buffer.concat(arr);

    const prefix = Buffer.from(
      `\u0019Ethereum Signed Message:\n${message.length.toString()}`,
      'utf-8',
    )
    const hash = utils.keccak(Buffer.concat([prefix, message]))
    return hash;
  } catch(err) {
    console.error(err);
    return null;
  }
}

const signatureIsValid = (paymentHash, hash, sig) => {
  try {
    const pub = utils.ecrecover(hash, sig.v, sig.r, sig.s);

    if(!pubKeyIsPaymentSender(paymentHash, pub)) {
      throw "Recovered Public Key is not sender of Payment.";
    }
    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
}

const pubKeyIsPaymentSender = (pubKey, paymentHash) => {
  // TODO: Implement later
  return true;
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}
