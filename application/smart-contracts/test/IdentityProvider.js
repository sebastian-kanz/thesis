var IdentityProvider = artifacts.require("./IdentityProvider.sol");

contract("IdentityProvider", () => {
    let owner;
    let accounts;
    beforeEach(async() => {
       accounts = await web3.eth.getAccounts();
       owner = accounts[0];
    });
    it('has an owner', async function () {
      const instance = await IdentityProvider.new();
      assert.equal(await instance.owner(), owner)
    });
    it('should be possible to transfer ownership', async function () {
      const instance = await IdentityProvider.new();
      let result = await instance.transferOwnership('0x4A21C369a3B7f4C56eC4DcBAB706C30897Cb1845');
      assert.equal(await instance.owner(), '0x4A21C369a3B7f4C56eC4DcBAB706C30897Cb1845')
    });
    it('should be callable', async function () {
      const instance = await IdentityProvider.new();
      let result = await instance.testConnection();
      assert.equal(result, true);
    });
    it('should be possible to query contract\'s address', async function () {
      const instance = await IdentityProvider.new();
      let result = await instance.getAddress();
      assert.equal(result, instance.address);
    });
    it("should be possible to add test identities", async () => {
      const instance = await IdentityProvider.new();
      await instance.addTestData();
      let result1 = await instance.identityExists.call('0xe3CBf35cD6FadEA91C4b9A19882Af976725753dD');
      assert.equal(result1, true);
      let result2 = await instance.identityExists.call('0x37848e7bDDbF872093D346f89be9B507eDf6462b');
      assert.equal(result2, true);
      let result3 = await instance.identityExists.call('0x8Ef5906034be23248EF49C38fEf9f17265ab044F');
      assert.equal(result3, true);
      let result4 = await instance.identityExists.call('0xf00C699c96E05f919EE1C57B824a29cC6216352E');
      assert.equal(result4, true);
      let result5 = await instance.identityExists.call('0xCF5f7aa0103662Ef67cF453F7d4A6bFDfF04057e');
      assert.equal(result5, true);
      let result6 = await instance.identityExists.call('0x4A21C369a3B7f4C56eC4DcBAB706C30897Cb1845');
      assert.equal(result6, true);
      let result7 = await instance.identityExists.call('0xEa05a247562D4865F6e2a5d9347EeB61C966A214');
      assert.equal(result7, true);
    });
    it("should be possible to query different roles", async () => {
      const instance = await IdentityProvider.new();
      await instance.addTestData();
      let result1 = await instance.getKnownManufacturers.call();
      assert.equal(result1[0], '0xe3CBf35cD6FadEA91C4b9A19882Af976725753dD');
      let result2 = await instance.getKnownServiceProviders.call();
      assert.equal(result2.length, 0);
      let result3 = await instance.getKnownSuppliers.call();
      assert.equal(result3.length, 0);
      let result4 = await instance.getKnownDevices.call();
      assert.equal(result4[0], '0xf00C699c96E05f919EE1C57B824a29cC6216352E');
    });
    it("should be possible to query different roles", async () => {
      const instance = await IdentityProvider.new();
      result = await instance.deleteIdentity.call('0x0000000000000000000000000000000000000000');
      assert.equal(result, false);
    });



    it("should be possible to add custom identities", async () => {
      const instance = await IdentityProvider.new();
      let result = await instance.identityExists.call(owner);
      assert.equal(result, false, "owner should not be added yet.");
      await instance.addIdentity("owner", 1, owner);
      result = await instance.identityExists.call(owner);
      assert.equal(result, true, "owner should be added now.");
      result = await instance.getIdentityName.call(owner);
      assert.equal(result, "owner", "name of owner is set incorrectly");
      result = await instance.getIdentityRole.call(owner);
      assert.equal(result, 1, "role of owner should be Manufacturer");
      result = await instance.getIdentityOwner.call(owner);
      assert.equal(result, owner, "owner of owner should be owner");
      result = await instance.getIdentityCreationTime.call(owner);

      try{
        let result = await instance.addIdentity("owner", 1, owner);
        assert(false);
      }
      catch(err){
          assert.include(String(err),'revert','should throw an revert error');
      }


      await instance.addIdentity("ServiceProvider", 3, accounts[1]);
      result = await instance.identityExists.call(accounts[1]);
      assert.equal(result, true);
      await instance.addIdentity("Supplier", 4, accounts[2]);
      result = await instance.identityExists.call(accounts[2]);
      assert.equal(result, true);

    });



    it("should be possible to process the identity\'s lifecycle from a manufacturers perspective", async () => {
      const instance = await IdentityProvider.new();

      let result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, false, "identity should not be added.");

      await instance.addIdentity("Manufacturer", 1, accounts[0]);
      result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, true, "identity should be added.");

      result = await instance.getIdentityRoleName.call(accounts[0]);
      assert.equal(result, "Manufacturer", "identity role should be Manufacturer.");

      result = await instance.getIdentityOwner.call(accounts[0]);
      assert.equal(result, accounts[0], "identity owner should be " + accounts[0] + ".");

      result = await instance.getIdentityRole.call(accounts[0]);
      assert.equal(result, 1, "identity role should be 1.");

      result = await instance.getIdentityCreationTime.call(accounts[0]);
      assert.equal(parseInt(result)>0, true, "CreationTime should be set.");

      result = await instance.getIdentityName.call(accounts[0]);
      assert.equal(result, "Manufacturer", "identity should be called Manufacturer.");

      await instance.deleteIdentity(accounts[0]);
      result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, false, "identity should be deleted.");

    });


    it("should be possible to process the identity\'s lifecycle from a customer\'s perspective", async () => {
      const instance = await IdentityProvider.new();

      let result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, false, "identity should not be added.");

      await instance.addIdentity("Customer", 2, accounts[0]);
      result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, true, "identity should be added.");

      result = await instance.getIdentityRoleName.call(accounts[0]);
      assert.equal(result, "Customer", "identity role should be Customer.");

      result = await instance.getIdentityOwner.call(accounts[0]);
      assert.equal(result, accounts[0], "identity owner should be " + accounts[0] + ".");

      result = await instance.getIdentityRole.call(accounts[0]);
      assert.equal(result, 2, "identity role should be 2.");

      result = await instance.getIdentityCreationTime.call(accounts[0]);
      assert.equal(parseInt(result)>0, true, "CreationTime should be set.");

      result = await instance.getIdentityName.call(accounts[0]);
      assert.equal(result, "Customer", "identity should be called Customer.");

      await instance.deleteIdentity(accounts[0]);
      result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, false, "identity should be deleted.");

    });


    it("should be possible to process the identity\'s lifecycle from a service providers\'s perspective", async () => {
      const instance = await IdentityProvider.new();

      let result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, false, "identity should not be added.");

      await instance.addIdentity("ServiceProvider", 3, accounts[0]);
      result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, true, "identity should be added.");

      result = await instance.getIdentityRoleName.call(accounts[0]);
      assert.equal(result, "ServiceProvider", "identity role should be ServiceProvider.");

      result = await instance.getIdentityOwner.call(accounts[0]);
      assert.equal(result, accounts[0], "identity owner should be " + accounts[0] + ".");

      result = await instance.getIdentityRole.call(accounts[0]);
      assert.equal(result, 3, "identity role should be 3.");

      result = await instance.getIdentityCreationTime.call(accounts[0]);
      assert.equal(parseInt(result)>0, true, "CreationTime should be set.");

      result = await instance.getIdentityName.call(accounts[0]);
      assert.equal(result, "ServiceProvider", "identity should be called ServiceProvider.");

      await instance.deleteIdentity(accounts[0]);
      result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, false, "identity should be deleted.");

    });


    it("should be possible to process the identity\'s lifecycle from a supplier\'s perspective", async () => {
      const instance = await IdentityProvider.new();

      let result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, false, "identity should not be added.");

      await instance.addIdentity("Supplier", 4, accounts[0]);
      result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, true, "identity should be added.");

      result = await instance.getIdentityRoleName.call(accounts[0]);
      assert.equal(result, "Supplier", "identity role should be Supplier.");

      result = await instance.getIdentityOwner.call(accounts[0]);
      assert.equal(result, accounts[0], "identity owner should be " + accounts[0] + ".");

      result = await instance.getIdentityRole.call(accounts[0]);
      assert.equal(result, 4, "identity role should be 4.");

      result = await instance.getIdentityCreationTime.call(accounts[0]);
      assert.equal(parseInt(result)>0, true, "CreationTime should be set.");

      result = await instance.getIdentityName.call(accounts[0]);
      assert.equal(result, "Supplier", "identity should be called Supplier.");

      await instance.deleteIdentity(accounts[0]);
      result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, false, "identity should be deleted.");

    });


    it("should be possible to process the identity\'s lifecycle from a device\'s perspective", async () => {
      const instance = await IdentityProvider.new();

      let result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, false, "identity should not be added.");

      await instance.addIdentity("Owner", 1, accounts[1]);
      await instance.addIdentityOwnedBy("Device", 5, accounts[0], accounts[1]);
      result = await instance.identityExists.call(accounts[1]);
      assert.equal(result, true, "owner should be added.");
      result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, true, "identity should be added.");

      result = await instance.getIdentityRoleName.call(accounts[0]);
      assert.equal(result, "Device", "identity role should be Device.");

      result = await instance.getIdentityOwner.call(accounts[0]);
      assert.equal(result, accounts[1], "identity owner should be " + accounts[1] + ".");

      result = await instance.getIdentityRole.call(accounts[0]);
      assert.equal(result, 5, "identity role should be 5.");

      result = await instance.getIdentityCreationTime.call(accounts[0]);
      assert.equal(parseInt(result)>0, true, "CreationTime should be set.");

      result = await instance.getIdentityName.call(accounts[0]);
      assert.equal(result, "Device", "identity should be called Device.");

      await instance.deleteIdentity(accounts[0]);
      result = await instance.identityExists.call(accounts[0]);
      assert.equal(result, false, "identity should be deleted.");

    });
// addIdentityOwnedBy
// addIdentity
//
// identityExists
// getIdentityRoleName
// getIdentityOwner
// getIdentityRole
// getIdentityCreationTime
// getIdentityName
//
// getKnownManufacturers
// getKnownServiceProviders
// getKnownSuppliers
// getKnownDevices
//
// deleteIdentity
//
// addTestData

    it("should be possible to own an identity", async () => {
      const instance = await IdentityProvider.new();
      let result = await instance.identityExists.call(owner);
      assert.equal(result, false, "owner should not be added yet.");
      await instance.addIdentity("owner", 1, owner);
      await instance.addIdentityOwnedBy("devicename", 5, accounts[1], owner);
      result = await instance.identityExists.call(owner);
      assert.equal(result, true, "owner should be added now.");
      result = await instance.getIdentityOwner.call(owner);
      assert.equal(result, owner, "owner of owner should be owner");
      result = await instance.getIdentityOwner.call(accounts[1]);
      assert.equal(result, owner, "owner of accounts[1] should be owner");

    });

    it("should only be possible to add an identity by owner", async () => {
      const instance = await IdentityProvider.new();
      try{
        let result = await instance.addIdentity("owner", 1, accounts[0], {from: accounts[1]});
        assert(false);
      }
      catch(err){
          assert.include(String(err),'revert','should throw an revert error');
      }
    });

    it("should be possible to delete identities", async () => {
      const instance = await IdentityProvider.new();
      let result = await instance.identityExists.call(owner);
      assert.equal(result, false, "owner should not be added yet.");
      await instance.addIdentity("owner", 1, owner);
      result = await instance.identityExists.call(owner);
      assert.equal(result, true, "owner should be added now.");
      result = await instance.deleteIdentity.call(owner);
      assert.equal(result, true, "deleting was unsuccessful.");

    });

    it("should only be possible to delete an identity by owner", async () => {
      const instance = await IdentityProvider.new();
      await instance.addIdentity("owner", 1, owner);
      try{
        let result = await instance.deleteIdentity(owner, {from: accounts[1]});
        assert(false);
      }
      catch(err){
          assert.include(String(err),'revert','should throw an revert error');
      }
    });
});
