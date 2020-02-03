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
      let hash = await web3.utils.soliditySha3("test");
      await payment.addPaymentAgreement(hash, receiver, sender);
    });
    it("should be possible to charge a rental agreement", async () => {
      let payment = await PaymentProvider.new();
      let sender = accounts[0];
      let receiver = accounts[1];
      let hash = await web3.utils.soliditySha3("test");
      let amount = 10;
      await payment.addPaymentAgreement(hash, receiver, sender);
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
      let hash = await web3.utils.soliditySha3("test");
      let amount = 1000000000000000000;
      await payment.addPaymentAgreement(hash, receiver, sender);
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
      let hash = await web3.utils.soliditySha3("test");
      let amount = 10;
      await payment.addPaymentAgreement(hash, receiver, sender);
      await payment.charge(hash,{from: sender, value: amount});


      let timestampStart = 1580386021;
      let timestampEnd = 1580396023;
      let units = 5;
      let costs = units * 1;
      let hash2 = await web3.utils.soliditySha3(payment.address, timestampStart, timestampEnd, units, costs);
      let signature = await web3.eth.sign(hash2,sender);

      let balanceBefore = await web3.eth.getBalance(payment.address);
      await payment.redeem(hash,timestampStart,timestampEnd,units,costs,signature, {from: receiver});

      let balanceAfter = await web3.eth.getBalance(payment.address);

      let total = parseInt(balanceBefore) - parseInt(balanceAfter);

      assert.equal(total, 5, "Balances before and after do not match.");

    });

    it("should be possible to get the payment history", async () => {
      let balance = await web3.eth.getBalance(accounts[0]);
      let payment = await PaymentProvider.new();
      let sender = accounts[0];
      let receiver = accounts[1];
      let hash = await web3.utils.soliditySha3("test");
      let amount = 10;
      await payment.addPaymentAgreement(hash, receiver, sender);
      await payment.charge(hash,{from: sender, value: amount});


      let timestampStart = 1580386021;
      let timestampEnd = 1580396023;
      let units = 10;
      let costs = units * 1;
      let hash2 = await web3.utils.soliditySha3(payment.address, timestampStart, timestampEnd, units, costs);
      let signature = await web3.eth.sign(hash2,sender);

      let balanceBefore = await web3.eth.getBalance(receiver);
      let tx = await payment.redeem(hash,timestampStart,timestampEnd,units,costs,signature, {from: receiver});
      let result = await payment.getPaymentHistory(hash);
      assert.equal(result[0].toString(), timestampStart, "timestampsStart does not match.");
      assert.equal(result[1].toString(), timestampEnd, "timestampEnd does not match.");
      assert.equal(result[2].toString(), units, "units do not match.");
      assert.equal(result[3].toString(), costs, "costs do not match.");

    });
});
