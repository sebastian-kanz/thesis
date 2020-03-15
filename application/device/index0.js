const fs = require('fs');
var utils = require('ethereumjs-util');
require('log-timestamp');
const { exec } = require("child_process");

const ipc = require('node-ipc');

var socketId = 'icp-test';
ipc.config.id   = 'hello';
ipc.config.socketRoot = '/tmp/';
ipc.config.appspace = '';

ipc.config.retry= 1500;
ipc.connectTo(
 socketId,
 function(){
   ipc.of[socketId].on(
     'connect',
     function(){
       console.log("Connected!!");
       ipc.log('## connected to world ##'.rainbow, ipc.config.delay);
       ipc.of[socketId].emit(
         'message',  //any event or message type your server listens for
         'hello'
       )
     }
   );
   ipc.of[socketId].on(
     'disconnect',
     function(){
       console.log("Disconnected!!");
       ipc.log('disconnected from world'.notice);
     }
   );
   ipc.of[socketId].on(
     'message',  //any event or message type your server listens for
     function(data){
       console.log("Got a message!!");
       ipc.log('got a message from world : '.debug, data);
     }
   );
 }
);














// execute C file for listening for nfc devices and writing json file with answer
// TODO: pass data (paymentHash, timestampStart, etc.) as parameters
const test = exec("./device", (error, stdout, stderr) => console.log(stdout));

test.stdout.on('data', (chunk) => {
  // data from standard output is here as buffers
  console.log(chunk);
});


const signedPaymentFile = './signedPayment.json';


// TODO: init web3. call smart contract and check balance of payment channel
// save information to init.json in case of connection loss
// if init.json exists, load information (how many coffees were ordered yet?, how much money is left in the payment channel?)
// write function for periodically redeeming payment data, for testing purposes set interval to every second.
// write dummy function for making coffee

fs.watchFile(signedPaymentFile, async (curr, prev) => {
  console.log("Received new payment data:");
  let ts = Math.floor(Date.now()/1000);
  await fs.copyFile(signedPaymentFile, `./paymentHistory/${ts}.json`, (err) => {
    if (err) throw err;
  });
  let rawdata = fs.readFileSync(signedPaymentFile);
  let signedPayment = JSON.parse(rawdata);
  console.log(signedPayment);
  // TODO: validate payment data

  try {

    // bytes32 paymentHash = keccak256(abi.encodePacked(_hash, _timestampStart, _timestampEnd, _units, _cost, _signature, _device));

    let paymentHash = Buffer.from(signedPayment.paymentHash);
    let timestampStart = Buffer.from(signedPayment.timestampStart);
    let timestampEnd = Buffer.from(signedPayment.timestampEnd);
    // let timestampEnd = Buffer.from(Math.round(new Date().getTime()/1000).toString());
    let units = Buffer.from(signedPayment.units);
    // let units = Buffer.from((parseInt(signedPayment.units) + 1).toString());
    let cost = Buffer.from(signedPayment.usageFee);
    let device = Buffer.from(signedPayment.device);
    let arr = [paymentHash, timestampStart, timestampEnd, units, cost, device];
    let message = Buffer.concat(arr);

    const prefix = Buffer.from(
      `\u0019Ethereum Signed Message:\n${message.length.toString()}`,
      'utf-8',
    )
    let hash = utils.keccak(Buffer.concat([prefix, message]))

    console.log("Message: 0x" + message.toString('hex'));
    console.log("Prefixed Message: ", utils.bufferToHex(Buffer.concat([prefix, message])));
    console.log("Hash: ", utils.bufferToHex(hash));
    console.log("Signature: 0x" + signedPayment.signature);


    const sig = utils.fromRpcSig("0x"+signedPayment.signature);
    let pub = utils.ecrecover(hash, sig.v, sig.r, sig.s);
    console.log("Recovered PubKey: ",utils.bufferToHex(pub));
    console.log("Address: ", utils.bufferToHex(utils.pubToAddress(pub)));


  } catch (err) {
    console.error(err);
  }





});

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}
