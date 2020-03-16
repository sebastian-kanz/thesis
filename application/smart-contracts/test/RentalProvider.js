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
    it("should be possible to destroy the contract", async () => {
      let rentalProvider = await RentalProvider.new();
      let result = await rentalProvider.destroy();
    });
    it("should be possible to query an oracle for all roles", async () => {
      let rentalProvider = await RentalProvider.new();
      let oracle = await IdentityProvider.new();
      let payment = await PaymentProvider.new();
      await payment.registerRentalProvider(rentalProvider.address);
      let payment_address = await payment.getAddress.call();
      await rentalProvider.registerPaymentProvider(payment_address);
      try {
        await oracle.addIdentity("accounts[0]", 0, accounts[0]);
        assert(false);
      } catch(err){
        assert.include(String(err),'revert','should throw an revert error');
      }
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

      let result = await rentalProvider.isKnownParticipant.call(accounts[0], 1);
      assert.equal(result, true, "accounts[0] should be Manufacturer.");
      result = await rentalProvider.isKnownParticipant.call(accounts[1], 2);
      assert.equal(result, true, "accounts[1] should be a Customer.");
      result = await rentalProvider.isKnownParticipant.call(accounts[2], 2);
      assert.equal(result, true, "accounts[2] should be a Customer.");
      result = await rentalProvider.isKnownParticipant.call(accounts[3], 5);
      assert.equal(result, true, "accounts[3] should be a Device.");
      result = await rentalProvider.isKnownParticipant.call(accounts[4], 5);
      assert.equal(result, true, "accounts[4] should be a Device.");
      result = await rentalProvider.isKnownParticipant.call(accounts[5], 5);
      assert.equal(result, true, "accounts[5] should be a Device.");
      result = await rentalProvider.isKnownParticipant.call(accounts[6], 5);
      assert.equal(result, true, "accounts[6] should be a Device.");

    });
    it("should be possible to create a RentalAgreement", async () => {
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


      const lessor = accounts[0];
      const tenant = accounts[1];
      const device = accounts[3];
      const usageFee = 1;
      // const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
      const contractTerm = 1588272358;
      let signature = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
      await rentalProvider.createRequest(device, lessor, contractTerm, {from: tenant});

      await rentalProvider.createRenting(tenant, signature, device, usageFee, contractTerm);

      const data = await rentalProvider.getByID.call(0);
      const { 0: expected_tenant, 1: expected_tenantSignature, 2: expected_lessor, 3: expected_lessorSignature, 4: expected_device, 5: expected_usageFee, 6: expected_contractTerm, 8: expected_state } = data;
      assert.equal(expected_tenant, tenant, "tenant not as expected.");
      assert.equal(expected_lessor, accounts[0], "lessor not as expected.");
      assert.equal(expected_lessorSignature, signature, "lessorSignature not as expected.");
      assert.equal(expected_device, device, "device not as expected.");
      assert.equal(expected_usageFee, usageFee, "usageFee not as expected.");
      assert.equal(expected_contractTerm, contractTerm, "contractTerm not as expected.");
      assert.equal(expected_state, 0, "state not as expected.");

    });
    it("should only be possible to create a RentalAgreement for valid and known participants", async () => {
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

      const lessor = accounts[0];
      const tenant = accounts[3];
      const device = accounts[2];
      const usageFee = 1;
      const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
      let signature = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
      try{
        await rentalProvider.createRequest(device, lessor, contractTerm, {from: tenant});
        await rentalProvider.createRenting(tenant, signature, device, usageFee, contractTerm);
        assert(false);
      } catch(err){
        assert.include(String(err),'revert','should throw an revert error');
      }
    });
    it("should only be possible to query your own RentalAgreement", async () => {
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

      const lessor = accounts[0];
      const tenant = accounts[1];
      const device = accounts[3];
      const usageFee = 1;
      const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
      let signature = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
      await rentalProvider.createRequest(device, lessor, contractTerm, {from: tenant});
      await rentalProvider.createRenting(tenant, signature, device, usageFee, contractTerm);


      try{
        const data = await rentalProvider.getByID.call(0, {from: accounts[4]});
        assert(false);
      }
      catch(err){
          assert.include(String(err),'revert','should throw an revert error');
      }

    });
    it("should be possible to get your own RentalAgreement IDs", async () => {
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

      const lessor = accounts[0];
      const tenant = accounts[1];
      const device = accounts[3];
      const usageFee = 1;
      const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
      let signature1 = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
      let signature2 = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],accounts[4], 2, contractTerm),accounts[0]);
      let signature3 = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],accounts[5], 3, contractTerm),accounts[0]);
      let signature4 = await web3.eth.sign(web3.utils.soliditySha3(accounts[2],accounts[0],accounts[6], usageFee, contractTerm),accounts[0]);
      await rentalProvider.createRequest(device, lessor, contractTerm, {from: tenant});
      await rentalProvider.createRequest(accounts[4], lessor, contractTerm, {from: tenant});
      await rentalProvider.createRequest(accounts[5], lessor, contractTerm, {from: tenant});
      await rentalProvider.createRequest(accounts[6], lessor, contractTerm, {from: accounts[2]});

      await rentalProvider.createRenting(tenant, signature1, device, usageFee, contractTerm);
      await rentalProvider.createRenting(tenant, signature2, accounts[4], 2, contractTerm);
      await rentalProvider.createRenting(tenant, signature3, accounts[5], 3, contractTerm);
      await rentalProvider.createRenting(accounts[2], signature4, accounts[6], usageFee, contractTerm);

      result = await rentalProvider.getIDs.call(0,{from: accounts[1]});
      assert.equal(result.length,3, "mount of RentalAgreements differs.")
      // result.forEach((elem) => {
      //   console.log(elem.toString());
      // });
    });
    it("should be possible to sign and accept your own RentalAgreement", async () => {
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

      const lessor = accounts[0];
      const tenant = accounts[1];
      const device = accounts[3];
      const usageFee = 1;
      const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
      let signature1 = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
      await rentalProvider.createRequest(device, lessor, contractTerm, {from: tenant});
      await rentalProvider.createRenting(tenant, signature1, device, usageFee, contractTerm);

      let hash = web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm);
      let signature2 = await web3.eth.sign(hash,accounts[1]);

      await rentalProvider.accept(0, signature2, {from: accounts[1], value: 1000000000000000000});

      let data = await rentalProvider.getByID.call(0, {from: accounts[1]});
      const { 0: expected_tenant, 1: expected_tenantSignature, 2: expected_lessor, 3: expected_lessorSignature, 4: expected_device, 5: expected_usageFee, 6: expected_contractTerm, 7: expected_state } = data;
      assert.equal(expected_tenantSignature, signature2, "tenant signature invalid.");
    });
    it("should be possible to terminate a RentalAgreement", async () => {
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


      const lessor = accounts[0];
      const tenant = accounts[1];
      const device = accounts[3];
      const usageFee = 1;
      const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
      let signature = await web3.eth.sign(web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm),accounts[0]);
      await rentalProvider.createRequest(device, lessor, contractTerm, {from: tenant});
      await rentalProvider.createRenting(tenant, signature, device, usageFee, contractTerm);
      let hash = web3.utils.soliditySha3(tenant,accounts[0],device, usageFee, contractTerm);
      let signature2 = await web3.eth.sign(hash,accounts[1]);

      await rentalProvider.accept(0, signature2, {from: accounts[1], value: 1000000000000000000});
      await rentalProvider.terminate(0);
      const data = await rentalProvider.getByID.call(0);
      const { 0: expected_tenant, 1: expected_tenantSignature, 2: expected_lessor, 3: expected_lessorSignature, 4: expected_device, 5: expected_usageFee, 6: expected_contractTerm, 8: expected_state } = data;
      assert.equal(expected_state, 2, "state not as expected.");
    });
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

      const device = accounts[3];
      const lessor = accounts[0];
      const contractTerm = 1589367025;
      const tenant = accounts[1];
      // const lessor = accounts[0];
      // const device = accounts[3];
      // const device2 = accounts[4];
      // const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
      await rentalProvider.createRequest(device, lessor, contractTerm, {from: tenant});
      // await rentalProvider.createRequest(device2, lessor, contractTerm, {from: tenant});
      const requests = await rentalProvider.getRequestsAsLessor.call({from: lessor});
      const requests2 = await rentalProvider.getRequestsAsTenant.call({from: tenant});
      // console.log(requests);
    });
});
