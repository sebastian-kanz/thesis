var Renting=artifacts.require ("./Renting.sol");
var DateLib=artifacts.require ("./DateLib.sol");
var Ownable=artifacts.require ("./Ownable.sol");
var IdentityOracle=artifacts.require ("./IdentityOracle.sol");

module.exports = function(deployer) {
      deployer.deploy(Renting);
      deployer.deploy(DateLib);
      deployer.deploy(Ownable);
      deployer.deploy(IdentityOracle);
}
