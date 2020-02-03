var RentalProvider = artifacts.require("./RentalProvider.sol");
var IdentityProvider = artifacts.require("./IdentityProvider.sol");
var PaymentProvider = artifacts.require("./PaymentProvider.sol");

contract("RentalProvider", function() {
    let owner;
    let accounts;
    console.log("Did you remove addTestData() in IdentityProvider.sol constructor?");
    beforeEach(async() => {
       accounts = await web3.eth.getAccounts();
       owner = accounts[0];
    });
    // it("should be possible to destroy the contract", async () => {
    //   let rentalProvider = await RentalProvider.new();
    //   let result = await rentalProvider.destroy();
    // });
    // it("should be possible to query an oracle for all roles", async () => {
    //   let rentalProvider = await RentalProvider.new();
    //   let oracle = await IdentityProvider.new();
    //   let payment = await PaymentProvider.new();
    //   await payment.registerRentalProvider(rentalProvider.address);
    //   let payment_address = await payment.getAddress.call();
    //   await rentalProvider.registerPaymentProvider(payment_address);
    //   try {
    //     await oracle.addIdentity("accounts[0]", 0, accounts[0]);
    //     assert(false);
    //   } catch(err){
    //     assert.include(String(err),'revert','should throw an revert error');
    //   }
    //   await oracle.addIdentity("accounts[0]", 1, accounts[0]);
    //   await oracle.addIdentity("accounts[1]", 2, accounts[1]);
    //   await oracle.addIdentity("accounts[2]", 2, accounts[2]);
    //   await oracle.addIdentityOwnedBy("accounts[3]", 5, accounts[3], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[4]", 5, accounts[4], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[5]", 5, accounts[5], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[6]", 5, accounts[6], accounts[0]);
    //   let oracle_address = await oracle.getAddress.call();
    //   await rentalProvider.registerIdentityProvider(oracle_address);
    //   await rentalProvider.init();
    //
    //   let result = await rentalProvider.isKnownParticipant.call(accounts[0], 1);
    //   assert.equal(result, true, "accounts[0] should be Manufacturer.");
    //   result = await rentalProvider.isKnownParticipant.call(accounts[1], 2);
    //   assert.equal(result, true, "accounts[1] should be a Customer.");
    //   result = await rentalProvider.isKnownParticipant.call(accounts[2], 2);
    //   assert.equal(result, true, "accounts[2] should be a Customer.");
    //   result = await rentalProvider.isKnownParticipant.call(accounts[3], 5);
    //   assert.equal(result, true, "accounts[3] should be a Device.");
    //   result = await rentalProvider.isKnownParticipant.call(accounts[4], 5);
    //   assert.equal(result, true, "accounts[4] should be a Device.");
    //   result = await rentalProvider.isKnownParticipant.call(accounts[5], 5);
    //   assert.equal(result, true, "accounts[5] should be a Device.");
    //   result = await rentalProvider.isKnownParticipant.call(accounts[6], 5);
    //   assert.equal(result, true, "accounts[6] should be a Device.");
    //
    // });
    // it("should be possible to create a RentalAgreement", async () => {
    //   let rentalProvider = await RentalProvider.new();
    //   let oracle = await IdentityProvider.new();
    //   let payment = await PaymentProvider.new();
    //   await payment.registerRentalProvider(rentalProvider.address);
    //   let payment_address = await payment.getAddress.call();
    //   await rentalProvider.registerPaymentProvider(payment_address);
    //   await oracle.addIdentity("accounts[0]", 1, accounts[0]);
    //   await oracle.addIdentity("accounts[1]", 2, accounts[1]);
    //   await oracle.addIdentity("accounts[2]", 2, accounts[2]);
    //   await oracle.addIdentityOwnedBy("accounts[3]", 5, accounts[3], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[4]", 5, accounts[4], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[5]", 5, accounts[5], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[6]", 5, accounts[6], accounts[0]);
    //   let oracle_address = await oracle.getAddress.call();
    //   await rentalProvider.registerIdentityProvider(oracle_address);
    //   await rentalProvider.init();
    //
    //
    //   const tenant = accounts[1];
    //   const device = accounts[3];
    //   const usageFee = 1;
    //   // const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
    //   const contractTerm = 1589255236;
    //   let signature = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
    //   await rentalProvider.createRenting(tenant, signature, device, usageFee, contractTerm);
    //   const data = await rentalProvider.getByID.call(0);
    //   const { 0: expected_tenant, 1: expected_tenantSignature, 2: expected_lessor, 3: expected_lessorSignature, 4: expected_device, 5: expected_usageFee, 6: expected_contractTerm, 8: expected_state } = data;
    //   assert.equal(expected_tenant, tenant, "tenant not as expected.");
    //   assert.equal(expected_lessor, accounts[0], "lessor not as expected.");
    //   assert.equal(expected_lessorSignature, signature, "lessorSignature not as expected.");
    //   assert.equal(expected_device, device, "device not as expected.");
    //   assert.equal(expected_usageFee, usageFee, "usageFee not as expected.");
    //   assert.equal(expected_contractTerm, contractTerm, "contractTerm not as expected.");
    //   assert.equal(expected_state, 0, "state not as expected.");
    //
    // });
    // it("should only be possible to create a RentalAgreement for valid and known participants", async () => {
    //   let rentalProvider = await RentalProvider.new();
    //   let oracle = await IdentityProvider.new();
    //   let payment = await PaymentProvider.new();
    //   await payment.registerRentalProvider(rentalProvider.address);
    //   let payment_address = await payment.getAddress.call();
    //   await rentalProvider.registerPaymentProvider(payment_address);
    //   await oracle.addIdentity("accounts[0]", 1, accounts[0]);
    //   await oracle.addIdentity("accounts[1]", 2, accounts[1]);
    //   await oracle.addIdentity("accounts[2]", 2, accounts[2]);
    //   await oracle.addIdentityOwnedBy("accounts[3]", 5, accounts[3], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[4]", 5, accounts[4], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[5]", 5, accounts[5], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[6]", 5, accounts[6], accounts[0]);
    //   let oracle_address = await oracle.getAddress.call();
    //   await rentalProvider.registerIdentityProvider(oracle_address);
    //   await rentalProvider.init();
    //
    //   const tenant = accounts[3];
    //   const device = accounts[2];
    //   const usageFee = 1;
    //   const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
    //   let signature = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
    //   try{
    //     await rentalProvider.createRenting(tenant, signature, device, usageFee, contractTerm);
    //     assert(false);
    //   } catch(err){
    //     assert.include(String(err),'revert','should throw an revert error');
    //   }
    // });
    // it("should only be possible to query your own RentalAgreement", async () => {
    //   let rentalProvider = await RentalProvider.new();
    //   let oracle = await IdentityProvider.new();
    //   let payment = await PaymentProvider.new();
    //   await payment.registerRentalProvider(rentalProvider.address);
    //   let payment_address = await payment.getAddress.call();
    //   await rentalProvider.registerPaymentProvider(payment_address);
    //   await oracle.addIdentity("accounts[0]", 1, accounts[0]);
    //   await oracle.addIdentity("accounts[1]", 2, accounts[1]);
    //   await oracle.addIdentity("accounts[2]", 2, accounts[2]);
    //   await oracle.addIdentityOwnedBy("accounts[3]", 5, accounts[3], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[4]", 5, accounts[4], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[5]", 5, accounts[5], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[6]", 5, accounts[6], accounts[0]);
    //   let oracle_address = await oracle.getAddress.call();
    //   await rentalProvider.registerIdentityProvider(oracle_address);
    //   await rentalProvider.init();
    //
    //   const tenant = accounts[1];
    //   const device = accounts[3];
    //   const usageFee = 1;
    //   const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
    //   let signature = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
    //   await rentalProvider.createRenting(tenant, signature, device, usageFee, contractTerm);
    //
    //
    //   try{
    //     const data = await rentalProvider.getByID.call(0, {from: accounts[4]});
    //     assert(false);
    //   }
    //   catch(err){
    //       assert.include(String(err),'revert','should throw an revert error');
    //   }
    //
    // });
    // it("should be possible to get your own RentalAgreement IDs", async () => {
    //   let rentalProvider = await RentalProvider.new();
    //   let oracle = await IdentityProvider.new();
    //   let payment = await PaymentProvider.new();
    //   await payment.registerRentalProvider(rentalProvider.address);
    //   let payment_address = await payment.getAddress.call();
    //   await rentalProvider.registerPaymentProvider(payment_address);
    //   await oracle.addIdentity("accounts[0]", 1, accounts[0]);
    //   await oracle.addIdentity("accounts[1]", 2, accounts[1]);
    //   await oracle.addIdentity("accounts[2]", 2, accounts[2]);
    //   await oracle.addIdentityOwnedBy("accounts[3]", 5, accounts[3], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[4]", 5, accounts[4], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[5]", 5, accounts[5], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[6]", 5, accounts[6], accounts[0]);
    //   let oracle_address = await oracle.getAddress.call();
    //   await rentalProvider.registerIdentityProvider(oracle_address);
    //   await rentalProvider.init();
    //
    //   const tenant = accounts[1];
    //   const device = accounts[3];
    //   const usageFee = 1;
    //   const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
    //   let signature1 = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
    //   let signature2 = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],accounts[4], 2, contractTerm),accounts[0]);
    //   let signature3 = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],accounts[5], 3, contractTerm),accounts[0]);
    //   let signature4 = await web3.eth.sign(web3.utils.soliditySha3(accounts[2],accounts[0],accounts[6], usageFee, contractTerm),accounts[0]);
    //   await rentalProvider.createRenting(tenant, signature1, device, usageFee, contractTerm);
    //   await rentalProvider.createRenting(tenant, signature2, accounts[4], 2, contractTerm);
    //   await rentalProvider.createRenting(tenant, signature3, accounts[5], 3, contractTerm);
    //   await rentalProvider.createRenting(accounts[2], signature4, accounts[6], usageFee, contractTerm);
    //
    //   result = await rentalProvider.getIDs.call(0,{from: accounts[1]});
    //   assert.equal(result.length,3, "mount of RentalAgreements differs.")
    //   // result.forEach((elem) => {
    //   //   console.log(elem.toString());
    //   // });
    // });
    // it("should be possible to sign and accept your own RentalAgreement", async () => {
    //   let rentalProvider = await RentalProvider.new();
    //   let oracle = await IdentityProvider.new();
    //   let payment = await PaymentProvider.new();
    //   await payment.registerRentalProvider(rentalProvider.address);
    //   let payment_address = await payment.getAddress.call();
    //   await rentalProvider.registerPaymentProvider(payment_address);
    //   await oracle.addIdentity("accounts[0]", 1, accounts[0]);
    //   await oracle.addIdentity("accounts[1]", 2, accounts[1]);
    //   await oracle.addIdentity("accounts[2]", 2, accounts[2]);
    //   await oracle.addIdentityOwnedBy("accounts[3]", 5, accounts[3], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[4]", 5, accounts[4], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[5]", 5, accounts[5], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[6]", 5, accounts[6], accounts[0]);
    //   let oracle_address = await oracle.getAddress.call();
    //   await rentalProvider.registerIdentityProvider(oracle_address);
    //   await rentalProvider.init();
    //
    //   const tenant = accounts[1];
    //   const device = accounts[3];
    //   const usageFee = 1;
    //   const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
    //   let signature1 = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
    //   await rentalProvider.createRenting(tenant, signature1, device, usageFee, contractTerm);
    //
    //   let hash = web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm);
    //   let signature2 = await web3.eth.sign(hash,accounts[1]);
    //
    //   await rentalProvider.accept(0, signature2, {from: accounts[1], value: 1000000000000000000});
    //
    //   let data = await rentalProvider.getByID.call(0, {from: accounts[1]});
    //   const { 0: expected_tenant, 1: expected_tenantSignature, 2: expected_lessor, 3: expected_lessorSignature, 4: expected_device, 5: expected_usageFee, 6: expected_contractTerm, 7: expected_state } = data;
    //   assert.equal(expected_tenantSignature, signature2, "tenant signature invalid.");
    // });
    // it("should be possible to terminate a RentalAgreement", async () => {
    //   let rentalProvider = await RentalProvider.new();
    //   let oracle = await IdentityProvider.new();
    //   let payment = await PaymentProvider.new();
    //   await payment.registerRentalProvider(rentalProvider.address);
    //   let payment_address = await payment.getAddress.call();
    //   await rentalProvider.registerPaymentProvider(payment_address);
    //   await oracle.addIdentity("accounts[0]", 1, accounts[0]);
    //   await oracle.addIdentity("accounts[1]", 2, accounts[1]);
    //   await oracle.addIdentity("accounts[2]", 2, accounts[2]);
    //   await oracle.addIdentityOwnedBy("accounts[3]", 5, accounts[3], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[4]", 5, accounts[4], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[5]", 5, accounts[5], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[6]", 5, accounts[6], accounts[0]);
    //   let oracle_address = await oracle.getAddress.call();
    //   await rentalProvider.registerIdentityProvider(oracle_address);
    //   await rentalProvider.init();
    //
    //
    //   const tenant = accounts[1];
    //   const device = accounts[3];
    //   const usageFee = 1;
    //   const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
    //   let signature = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
    //   await rentalProvider.createRenting(tenant, signature, device, usageFee, contractTerm);
    //   let hash = web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm);
    //   let signature2 = await web3.eth.sign(hash,accounts[1]);
    //
    //   await rentalProvider.accept(0, signature2, {from: accounts[1], value: 1000000000000000000});
    //   await rentalProvider.terminate(0);
    //   const data = await rentalProvider.getByID.call(0);
    //   const { 0: expected_tenant, 1: expected_tenantSignature, 2: expected_lessor, 3: expected_lessorSignature, 4: expected_device, 5: expected_usageFee, 6: expected_contractTerm, 8: expected_state } = data;
    //   assert.equal(expected_state, 2, "state not as expected.");
    // });
    it("should be possible to create a request", async () => {
      let rentalProvider = await RentalProvider.new();
      let oracle = await IdentityProvider.new();
      let payment = await PaymentProvider.new();
      await payment.registerRentalProvider(rentalProvider.address);
      let payment_address = await payment.getAddress.call();
      await rentalProvider.registerPaymentProvider(payment_address);
      await oracle.addIdentity("accounts[0]", 1, accounts[0]);
      await oracle.addIdentity("accounts[1]", 2, accounts[1]);
      await oracle.addIdentity("accounts[2]", 2, accounts[2]);
      await oracle.addIdentityOwnedBy("accounts[3]", 5, accounts[3], accounts[0]);
      await oracle.addIdentityOwnedBy("accounts[4]", 5, accounts[4], accounts[0]);
      await oracle.addIdentityOwnedBy("accounts[5]", 5, accounts[5], accounts[0]);
      await oracle.addIdentityOwnedBy("accounts[6]", 5, accounts[6], accounts[0]);
      let oracle_address = await oracle.getAddress.call();
      await rentalProvider.registerIdentityProvider(oracle_address);
      await rentalProvider.init();

      const device = '0xbb8f0d80e1b66e71629d47ab547042e5004f39df';
      const lessor = '0x6Aa031Ecb47018c081ae968FE157cB9f74a584fD';
      const contractTerm = 1589367025;
      const tenant = '0xFF3904784BeF847991C7705Eef89164A32F31A19';
      // const lessor = accounts[0];
      // const device = accounts[3];
      // const device2 = accounts[4];
      // const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
      await rentalProvider.createRequest(device, lessor, contractTerm, {from: tenant});
      // await rentalProvider.createRequest(device2, lessor, contractTerm, {from: tenant});
      const requests = await rentalProvider.getRequests.call({from: lessor});
      // console.log(requests);
    });
    // it("should be possible to pay for usage", async () => {
    //   let rentalProvider = await RentalProvider.new();
    //   let oracle = await IdentityProvider.new();
    //   await oracle.addIdentity("accounts[0]", 1, accounts[0]);
    //   await oracle.addIdentity("accounts[1]", 2, accounts[1]);
    //   await oracle.addIdentity("accounts[2]", 2, accounts[2]);
    //   await oracle.addIdentityOwnedBy("accounts[3]", 5, accounts[3], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[4]", 5, accounts[4], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[5]", 5, accounts[5], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[6]", 5, accounts[6], accounts[0]);
    //   let oracle_address = await oracle.getAddress.call();
    //   await rentalProvider.registerIdentityProvider(oracle_address);
    //   await rentalProvider.init();
    //
    //   const tenant = accounts[1];
    //   const device = accounts[3];
    //   const usageFee = 1;
    //   const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
    //   let signature1 = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
    //   await rentalProvider.createRenting(tenant, signature1, device, usageFee, contractTerm);
    //
    //   let hash = web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm);
    //   let signature2 = await web3.eth.sign(hash,accounts[1]);
    //
    //   await rentalProvider.accept(0, signature2, {from: accounts[1]});
    //   let data = await rentalProvider.getByID.call(0, {from: accounts[1]});
    //   const { 0: expected_tenant, 1: expected_tenantSignature, 2: expected_lessor, 3: expected_lessorSignature, 4: expected_device, 5: expected_usageFee, 6: expected_contractTerm, 7: expected_state } = data;
    //   assert.equal(expected_tenantSignature, signature2, "tenant signature invalid.");
    //   let timestamp = Math.round(new Date().getTime()/1000);
    //   result = await rentalProvider.payForUsage(0, timestamp, {from: accounts[1], value: usageFee});
    //   try {
    //     timestamp = Math.round(new Date().getTime()/1000);
    //     result = await rentalProvider.payForUsage(1, timestamp, {from: accounts[1], value: usageFee});
    //     assert(false);
    //   } catch(err) {
    //       assert.include(String(err),'revert','should throw an revert error');
    //   }
    //   try {
    //     timestamp = Math.round(new Date().getTime()/1000);
    //     result = await rentalProvider.payForUsage(0, timestamp, {from: accounts[2], value: usageFee});
    //     assert(false);
    //   } catch(err) {
    //       assert.include(String(err),'revert','should throw an revert error');
    //   }
    //   try {
    //     timestamp = Math.round(new Date().getTime()/1000);
    //     result = await rentalProvider.payForUsage(0, timestamp, {from: accounts[1], value: 2});
    //     assert(false);
    //   } catch(err) {
    //       assert.include(String(err),'revert','should throw an revert error');
    //   }
    //
    // });
    // it("should be possible to check payments as corresponding device", async () => {
    //   let rentalProvider = await RentalProvider.new();
    //   let oracle = await IdentityProvider.new();
    //   await oracle.addIdentity("accounts[0]", 1, accounts[0]);
    //   await oracle.addIdentity("accounts[1]", 2, accounts[1]);
    //   await oracle.addIdentity("accounts[2]", 2, accounts[2]);
    //   await oracle.addIdentityOwnedBy("accounts[3]", 5, accounts[3], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[4]", 5, accounts[4], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[5]", 5, accounts[5], accounts[0]);
    //   await oracle.addIdentityOwnedBy("accounts[6]", 5, accounts[6], accounts[0]);
    //   let oracle_address = await oracle.getAddress.call();
    //   await rentalProvider.registerIdentityProvider(oracle_address);
    //   await rentalProvider.init();
    //
    //   const tenant1 = accounts[1];
    //   const tenant2 = accounts[2];
    //   const device = accounts[3];
    //   const usageFee = 1;
    //   const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
    //   let signature1 = await web3.eth.sign(web3.utils.soliditySha3(tenant1,accounts[0],device, usageFee, contractTerm),accounts[0]);
    //   let signature2 = await web3.eth.sign(web3.utils.soliditySha3(tenant2,accounts[0],accounts[4], usageFee, contractTerm),accounts[0]);
    //   await rentalProvider.createRenting(tenant1, signature1, device, usageFee, contractTerm);
    //   await rentalProvider.createRenting(tenant2, signature2, accounts[4], usageFee, contractTerm);
    //
    //   let hash1 = web3.utils.soliditySha3(tenant1,accounts[0],device, usageFee, contractTerm);
    //   let signature3 = await web3.eth.sign(hash1,accounts[1]);
    //   let hash2 = web3.utils.soliditySha3(tenant2,accounts[0],accounts[4], usageFee, contractTerm);
    //   let signature4 = await web3.eth.sign(hash2,accounts[2]);
    //
    //   await rentalProvider.accept(0, signature3, {from: accounts[1]});
    //   await rentalProvider.accept(1, signature4, {from: accounts[2]});
    //
    //   let timestamp1 = Math.round(new Date().getTime()/1000);
    //   let paymentHash1 = web3.utils.soliditySha3(timestamp1, accounts[3], accounts[1], usageFee);
    //   result = await rentalProvider.getPaymentHash.call(timestamp1, accounts[3], accounts[1], usageFee);
    //   assert.equal(paymentHash1, result.toString(), "paymentHash1 not as expected.");
    //   let timestamp2 = Math.round(new Date().getTime()/1000);
    //   let paymentHash2 = web3.utils.soliditySha3(timestamp2, accounts[4], accounts[2], usageFee);
    //   result = await rentalProvider.getPaymentHash.call(timestamp2, accounts[4], accounts[2], usageFee);
    //   assert.equal(paymentHash2, result, "paymentHash2 not as expected.");
    //   let timestamp3 = Math.round(new Date().getTime()/1000);
    //   let paymentHash3 = web3.utils.soliditySha3(timestamp3, accounts[4], accounts[2], usageFee);
    //   result = await rentalProvider.getPaymentHash.call(timestamp3, accounts[4], accounts[2], usageFee);
    //   assert.equal(paymentHash3, result, "paymentHash3 not as expected.");
    //
    //   let balance1 = await web3.eth.getBalance(accounts[2]);
    //
    //   await rentalProvider.payForUsage(0, timestamp1, {from: accounts[1], value: usageFee});
    //   await rentalProvider.payForUsage(1, timestamp2, {from: accounts[2], value: usageFee});
    //   await rentalProvider.payForUsage(1, timestamp3, {from: accounts[2], value: usageFee});
    //
    //   let balance2 = await web3.eth.getBalance(accounts[2]);
    //   assert.equal(balance1 > balance2, true, "New balance incorrect.");
    //
    //   result = await rentalProvider.checkUsagePayment.call(0, paymentHash1, {from: accounts[3]});
    //   let { 0: t1, 1: d1, 2: p1, 3: a1 } = result;
    //   assert.equal(t1, timestamp1.toString(), "timestamp1 does not match.");
    //   assert.equal(d1, accounts[3], "device does not match.");
    //   assert.equal(p1, accounts[1], "payer does not match.");
    //   assert.equal(a1, usageFee, "amount does not match.");
    //   result = await rentalProvider.checkUsagePayment.call(1, paymentHash2, {from: accounts[4]});
    //   let { 0: t2, 1: d2, 2: p2, 3: a2 } = result;
    //   assert.equal(t2, timestamp2.toString(), "timestamp1 does not match.");
    //   assert.equal(d2, accounts[4], "device does not match.");
    //   assert.equal(p2, accounts[2], "payer does not match.");
    //   assert.equal(a2, usageFee, "amount does not match.");
    //   result = await rentalProvider.checkUsagePayment.call(1, paymentHash3, {from: accounts[4]});
    //   let { 0: t3, 1: d3, 2: p3, 3: a3 } = result;
    //   assert.equal(t3, timestamp3.toString(), "timestamp3 does not match.");
    //   assert.equal(d3, accounts[4], "device does not match.");
    //   assert.equal(p3, accounts[2], "payer does not match.");
    //   assert.equal(a3, usageFee, "amount does not match.");
    // });
});
