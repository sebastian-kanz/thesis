var IdentityOracle = artifacts.require("./IdentityOracle.sol");

contract("IdentityOracle", () => {
    let owner;
    let accounts;
    beforeEach(async() => {
       accounts = await web3.eth.getAccounts();
       owner = accounts[0];
    });
    it('has an owner', async function () {
      const instance = await IdentityOracle.new();
      assert.equal(await instance.owner(), owner)
    });
    it('should be callable', async function () {
      const instance = await IdentityOracle.new();
      let result = await instance.testConnection();
      assert.equal(result, true);
    });
    it("should be possible to add test identities", async () => {
      const instance = await IdentityOracle.new();
      await instance.addTestData();
      let result1 = await instance.identityExists.call('0x006371774597D7955cA57deFCF84d8B5a699D34A');
      assert.equal(result1, true);
      let result2 = await instance.identityExists.call('0x9ef7f517b0C5340911562c2788C6E4fdc18690f4');
      assert.equal(result2, true);
      let result3 = await instance.identityExists.call('0x43b3C4A156aFF47AdB9FB802644219a562C4AFB6');
      assert.equal(result3, true);
      let result4 = await instance.identityExists.call('0xEBf6D811269625389f188cb043555dB5392db69F');
      assert.equal(result4, true);
    });
    it("should be possible to add custom identities", async () => {
      const instance = await IdentityOracle.new();
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
      const instance = await IdentityOracle.new();
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
      const instance = await IdentityOracle.new();
      try{
        let result = await instance.addIdentity("owner", 1, accounts[9], {from: accounts[9]});
        assert(false);
      }
      catch(err){
          assert.include(String(err),'revert','should throw an revert error');
      }
    });

    it("should be possible to delete identities", async () => {
      const instance = await IdentityOracle.new();
      let result = await instance.identityExists.call(owner);
      assert.equal(result, false, "owner should not be added yet.");
      await instance.addIdentity("owner", 1, owner);
      result = await instance.identityExists.call(owner);
      assert.equal(result, true, "owner should be added now.");
      result = await instance.deleteIdentity.call(owner);
      assert.equal(result, true, "deleting was unsuccessful.");

    });

    it("should only be possible to delete an identity by owner", async () => {
      const instance = await IdentityOracle.new();
      await instance.addIdentity("owner", 1, owner);
      try{
        let result = await instance.deleteIdentity(owner, {from: accounts[9]});
        assert(false);
      }
      catch(err){
          assert.include(String(err),'revert','should throw an revert error');
      }
    });
});
