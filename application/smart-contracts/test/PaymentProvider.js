var PaymentProvider = artifacts.require("./PaymentProvider.sol");

contract("PaymentProvider", function() {
    let accounts;
    beforeEach(async() => {
       accounts = await web3.eth.getAccounts();
    });
    it("should be possible to create a payment agreement", async () => {
      let payment = await PaymentProvider.new();
      let sender = accounts[0];
      let receiver = accounts[1];
      let device = accounts[2];
      let hash = await web3.utils.soliditySha3("test");
      await payment.addPaymentAgreement(hash, receiver, sender, device);
    });
    it("should be possible to charge a rental agreement", async () => {
      let payment = await PaymentProvider.new();
      let sender = accounts[0];
      let receiver = accounts[1];
      let device = accounts[2];
      let hash = await web3.utils.soliditySha3("test");
      let amount = 10;
      await payment.addPaymentAgreement(hash, receiver, sender, device);
      let balanceBefore = await web3.eth.getBalance(payment.address);
      await payment.charge(hash,{from: sender, value: amount});
      let balanceAfter = await web3.eth.getBalance(payment.address);
      let total = parseInt(balanceAfter) - parseInt(balanceBefore)
      assert.equal(total, 10, "Balances before and after do not match.");
    });
    it("should be possible to empty a rental agreement", async () => {
      let payment = await PaymentProvider.new();
      let sender = accounts[0];
      let receiver = accounts[1];
      let device = accounts[2];
      let hash = await web3.utils.soliditySha3("test");
      let amount = 1000000000000000000;
      await payment.addPaymentAgreement(hash, receiver, sender, device);
      await payment.charge(hash,{from: sender, value: amount});
      let balanceBefore = await web3.eth.getBalance(sender);
      let tx = await payment.empty(hash,{from: receiver});
      let balanceAfter = await web3.eth.getBalance(sender);
      let total = parseInt(balanceBefore)-parseInt(balanceBefore);
      assert.equal(total, 0, "Balances before and after do not match.");
    });
    it("should be possible to process a payment", async () => {
      let balance = await web3.eth.getBalance(accounts[0]);
      let payment = await PaymentProvider.new();
      let sender = accounts[0];
      let receiver = accounts[1];
      let device = accounts[2];
      let hash = await web3.utils.soliditySha3("test");
      let amount = 50000000000000000;
      await payment.addPaymentAgreement(hash, receiver, sender, device);
      await payment.charge(hash,{from: sender, value: amount});


      let timestampStart = 1580386021;
      let timestampEnd = 1580396023;
      let units = 1;
      let costs = 5000000000000000;
      let hash2 = await web3.utils.soliditySha3(payment.address, timestampStart, timestampEnd, units, costs, device);
      let signature = await web3.eth.sign(hash2,sender);

      await payment.redeem(hash,timestampStart,timestampEnd,units,costs,signature,device,{from: receiver});

      let balanceAfter = await web3.eth.getBalance(payment.address);

      assert.equal(balanceAfter, amount - costs * units, "Balance does not match.");

    });

    it("should be possible to get the payment history", async () => {
      let balance = await web3.eth.getBalance(accounts[0]);
      let payment = await PaymentProvider.new();
      let sender = accounts[0];
      let receiver = accounts[1];
      let device = accounts[2];
      let hash = await web3.utils.soliditySha3("test");
      let amount = 50000000000000000;
      await payment.addPaymentAgreement(hash, receiver, sender, device);
      await payment.charge(hash,{from: sender, value: amount});


      let timestampStart = 1580386021;
      let timestampEnd = 1580396023;
      let units = 1;
      let costs = 5000000000000000;
      let hash2 = await web3.utils.soliditySha3(payment.address, timestampStart, timestampEnd, units, costs, device);
      let signature = await web3.eth.sign(hash2,sender);


      let balanceBefore = await web3.eth.getBalance(receiver);
      await payment.redeem(hash,timestampStart,timestampEnd,units,costs,signature,device,{from: receiver});
      let result = await payment.getPaymentHistory(hash);
      assert.equal(result[0].toString(), timestampStart, "timestampsStart does not match.");
      assert.equal(result[1].toString(), timestampEnd, "timestampEnd does not match.");
      assert.equal(result[2].toString(), units, "units do not match.");
      assert.equal(result[3].toString(), costs, "costs do not match.");

      assert.equal(await payment.getDevice.call(hash), device, "Device of payment is incorrect");
      assert.equal(await payment.getBalance.call(hash), amount - costs * units, "Balance of payment is incorrect");


    });
});
