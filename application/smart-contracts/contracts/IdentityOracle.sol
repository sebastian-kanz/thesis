pragma solidity >= 0.5.0 < 0.7.0;

import "./Ownable.sol";
import "./DateLib.sol";

/// @title IdentityOracle
/// @author Sebastian Kanz
/// @notice Taken from: https://github.com/jrkosinski/oracle-example/blob/part2-step1/oracle/contracts/BoxingOracle.sol
/// @notice Collects and provides information on identities
contract IdentityOracle is Ownable {
    mapping(address => Identity) identities;

    address[] knownDevices;
    address[] knownManufacturers;
    address[] knownServiceProviders;
    address[] knownSuppliers;

    using DateLib for DateLib.DateTime;

    //defines an identity
    struct Identity {
        string name;
        uint256 date;         //GMT timestamp of date of registration
        Role role;
        address ownedBy;
        bool exists;
    }

    //possible roles of identities
    enum Role {
      None,
      Manufacturer,
      Customer,
      ServiceProvider,
      Supplier,
      Device
    }

  /// @notice checks whether the identity is known or not
  /// @param _identity the identity address to analyze
  /// @return returns true if the identity is known
  function identityExists(address _identity) public view returns (bool) {
    if(identities[_identity].exists) {
      return true;
    } else {
      return false;
    }
  }

  /// @notice gets the role of the identity
  /// @param _identity the identity address to analyze
  /// @return a string representative of the Role. If the identity is unknown it returns the default (Role.None)
  function getIdentityRoleName(address _identity) public view returns (string memory) {
    Role role = identities[_identity].role;
    if(role == Role.Manufacturer) {
      return "Manufacturer";
    } else if(role == Role.Customer) {
      return "Customer";
    } else if(role == Role.ServiceProvider) {
      return "ServiceProvider";
    } else if(role == Role.Supplier) {
      return "Supplier";
    } else if(role == Role.Device) {
      return "Device";
    } else {
      return "None";
    }
  }

  /// @notice gets the owner of the identity (if it is a device)
  /// @param _identity the identity address to analyze
  /// @return an address. If the identity is owned by no one it returns the default address (0x0..)
  function getIdentityOwner(address _identity) public view returns (address) {
    return identities[_identity].ownedBy;
  }

  /// @notice gets the role of the identity
  /// @param _identity the identity address to analyze
  /// @return a uint. If the identity is unknown it returns the default (0)
  function getIdentityRole(address _identity) public view returns (uint) {
    return uint(identities[_identity].role);
  }

  /// @notice gets the creation time of the identity
  /// @param _identity the identity address to analyze
  /// @return a unix timestamp. If the identity is unknown it returns the default (0)
  function getIdentityCreationTime(address _identity) public view returns (uint256) {
    return identities[_identity].date;
  }

  /// @notice gets the name of the identity
  /// @param _identity the identity address to analyze
  /// @return a unix string. If the identity is unknown it returns the default (empty string)
  function getIdentityName(address _identity) public view returns (string memory) {
    return identities[_identity].name;
  }


  /// @notice adds a new identity
  /// @dev only callable by owner of smart contract
  /// @param _name the name of the identity
  /// @param _roleID the role of the identity as integer representative
  /// @param _identity the identity address to analyze
  /// @param _owner the owner of the identity
  function addIdentityOwnedBy(string memory _name, uint _roleID, address _identity, address _owner) onlyOwner public {
    require(!identityExists(_identity));
    require(identityExists(_owner));
    require(_roleID == 5);
    Identity memory newIdentity = Identity(_name, now, Role(_roleID), _owner, true);
    identities[_identity] = newIdentity;
    knownDevices.push(_identity);
  }

  /// @notice adds a new identity
  /// @dev only callable by owner of smart contract
  /// @param _name the name of the identity
  /// @param _roleID the role of the identity as integer representative
  /// @param _identity the identity address to analyze
  function addIdentity(string memory _name, uint _roleID, address _identity) onlyOwner public {
    require(!identityExists(_identity));
    require(_roleID > 0 && _roleID != 5);
    Identity memory newIdentity = Identity(_name, now, Role(_roleID), _identity, true);
    identities[_identity] = newIdentity;
    if(Role(_roleID) == Role.Manufacturer) {
      knownManufacturers.push(_identity);
    } else if(Role(_roleID) == Role.ServiceProvider) {
      knownServiceProviders.push(_identity);
    } else if(Role(_roleID) == Role.Supplier) {
      knownSuppliers.push(_identity);
    } else if(Role(_roleID) != Role.Customer) {
      revert("This should not happen.");
    }
  }

  /// @notice deletes an identity
  /// @dev only callable by owner of smart contract
  /// @param _identity the identity address to analyze
  /// @return a boolean whether or not deleting was successful
  function deleteIdentity(address _identity) onlyOwner public returns (bool) {
    if(identityExists(_identity)) {
      identities[_identity] = Identity("", 0, Role.None, address(0x0), false);
      if(identityExists(_identity)) {
        return false;
      } else {
      return true;

      }
    } else {
      return false;
    }
  }

  /// @notice tests the connection to the smart contract
  /// @dev only for testing purposes
  /// @return always true
  function testConnection() public pure returns (bool) {
    return true;
  }

  /// @notice gets the address of this contract test identities
  function getAddress() public view returns (address) {
    return address(this);
  }

  /// @notice adds test identities
  /// @dev only callable by owner of smart contract
  function addTestData() onlyOwner public {
    addIdentity("Testname 1", uint(Role.Manufacturer), address(0x006371774597D7955cA57deFCF84d8B5a699D34A));
    addIdentity("Testname 2", uint(Role.Customer), address(0x9ef7f517b0C5340911562c2788C6E4fdc18690f4));
    addIdentity("Testname 3", uint(Role.ServiceProvider), address(0x43b3C4A156aFF47AdB9FB802644219a562C4AFB6));
    addIdentity("Testname 4", uint(Role.Supplier), address(0xEBf6D811269625389f188cb043555dB5392db69F));
  }

  function getKnownManufacturers() public view returns(address[] memory){
    return knownManufacturers;
  }

  function getKnownServiceProviders() public view returns(address[] memory){
    return knownServiceProviders;
  }

  function getKnownSuppliers() public view returns(address[] memory){
    return knownSuppliers;
  }

  function getKnownDevices() public view returns(address[] memory){
    return knownDevices;
  }
}
