var RentalProvider=artifacts.require ("./RentalProvider.sol");
var Ownable=artifacts.require ("./Ownable.sol");
var IdentityProvider=artifacts.require ("./IdentityProvider.sol");
var PaymentProvider=artifacts.require ("./PaymentProvider.sol");

module.exports = function(deployer) {
      deployer.deploy(RentalProvider);
      deployer.deploy(Ownable);
      deployer.deploy(IdentityProvider);
      deployer.deploy(PaymentProvider);
}
