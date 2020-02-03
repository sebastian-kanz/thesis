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
    it('should be callable', async function () {
      const instance = await IdentityProvider.new();
      let result = await instance.testConnection();
      assert.equal(result, true);
    });
    it("should be possible to add test identities", async () => {
      const instance = await IdentityProvider.new();
      await instance.addTestData();
      let result1 = await instance.identityExists.call('0x6Aa031Ecb47018c081ae968FE157cB9f74a584fD');
      assert.equal(result1, true);
      let result2 = await instance.identityExists.call('0xFF3904784BeF847991C7705Eef89164A32F31A19');
      assert.equal(result2, true);
      let result3 = await instance.identityExists.call('0x87deeC84694929a63Aa8ccA01dE58eEA0a6A0e8b');
      assert.equal(result3, true);
      let result4 = await instance.identityExists.call('0xbB8f0d80e1B66e71629D47AB547042E5004F39Df');
      assert.equal(result4, true);
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

    });

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
