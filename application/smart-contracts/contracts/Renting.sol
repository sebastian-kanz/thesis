pragma solidity >= 0.5.0 < 0.7.0;

import "./IdentityOracle.sol";
import "./Ownable.sol";

contract Renting is Ownable {

  //possible states of an agreement
  enum AgreementState {
    Pending,
    Active,
    Terminated
  }

  RentalAgreement[] private agreements;

  struct RentalAgreement {
    address payable tenant;
    bytes tenantSignature;
    address payable lessor;
    bytes lessorSignature;
    address device;
    uint usageFee;        //
    uint contractTerm;    //unix timestamp
    uint creation;        //unix timestamp
    AgreementState state;
  }

  mapping(address => mapping(bytes32 => Payment)) private payments;

  struct Payment {
    uint timestamp;
    address device;
    address payer;
    uint amount;
  }

  address private oracle_addr;
  address payable public owner;

  constructor() public {
    owner = msg.sender;
  }

  function destroy() public {
    require(msg.sender == owner, "Only owner can call this function.");
    selfdestruct(owner);
  }

  /// @notice asks registered oracle whether the identity is known or not
  /// @param _addr the address of the identity address
  /// @param _roleID the role of the identity
  /// @return a boolean whether or not the identity is known
  function isKnownParticipant(address _addr, uint _roleID) public view returns(bool) {
      IdentityOracle oracle = IdentityOracle(oracle_addr);
      if(oracle.identityExists(_addr) && oracle.getIdentityRole(_addr) == _roleID) {
        return true;
      } else {
        return false;
      }
  }

  /// @notice sets the oracle address
  /// @dev only callable by owner
  /// @param _addr the address of the orcle
  function registerIdentityOracle(address _addr) public onlyOwner {
    oracle_addr = _addr;
  }

  /// @notice creates a rentalAgreement
  /// @param _tenant address of the tenant
  /// @param _lessorSignature signature of lessor of rentalAgreement
  /// @param _device address of device
  /// @param _usageFee fee for usage in wei
  /// @param _contractTerm timestamp, when rentalAgreement times out
  function create(address payable _tenant, bytes memory _lessorSignature, address _device, uint _usageFee, uint _contractTerm) public {
    //check if sender is Manufacturer, tenant is Customer and device is Device
    require(isKnownParticipant(msg.sender, 1));
    require(isKnownParticipant(_tenant, 2));
    require(isKnownParticipant(_device, 5));
    //check lessorSignature
    bytes32 message = keccak256(abi.encodePacked(_tenant, msg.sender, _device, _usageFee, _contractTerm));
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    require(recoverSigner(keccak256(abi.encodePacked(prefix, message)), _lessorSignature) == msg.sender);
    //check contractTerm to be in future!
    require(_contractTerm > now);
    //check that no rentalAgreement with same parameters exists
    require(!exists(_lessorSignature));
    agreements.push(RentalAgreement(_tenant, new bytes(65), msg.sender, _lessorSignature, _device, _usageFee, _contractTerm, now, AgreementState.Pending));
  }

  function exists(bytes memory _lessorSignature) private view returns (bool) {
    for(uint i = 0; i < agreements.length; i++) {
      if(keccak256(agreements[i].lessorSignature) == keccak256(_lessorSignature)) {
        return true;
      }
    }
    return false;
  }

  function getIDs(uint _stateID) public returns (uint[] memory) {
    uint count = 0;
    for(uint i = 0; i < agreements.length; i++) {
      if(agreements[i].tenant == msg.sender && agreements[i].state == AgreementState(_stateID) ) {
        count++;
      }
    }
    uint[] memory rentalAgreementIDs = new uint[](count);
    uint index = 0;
    for(uint i = 0; i < agreements.length; i++) {
      if(agreements[i].tenant == msg.sender && agreements[i].state == AgreementState(_stateID) ) {
        rentalAgreementIDs[index] = i;
        index++;
      }
    }
    return rentalAgreementIDs;
  }

  function getByID(uint _id) public view returns (address _tenant, bytes memory _tenantSignature, address _lessor, bytes memory _lessorSignature, address _device, uint _usageFee, uint _contractTerm, uint _state) {
    require(_id < agreements.length);
    RentalAgreement memory agreement = agreements[_id];
    require(msg.sender == agreement.tenant || msg.sender == agreement.lessor);
    return (agreement.tenant, agreement.tenantSignature, agreement.lessor, agreement.lessorSignature, agreement.device, agreement.usageFee, agreement.contractTerm, uint256(agreement.state));

  }

  function accept(uint _id, bytes memory _signature) public {
    require(_id < agreements.length);
    require(agreements[_id].state == AgreementState.Pending);
    require(agreements[_id].tenant == msg.sender);
    require(recoverSigner(getRentalAgreementHash(_id), _signature) == msg.sender);
    agreements[_id].tenantSignature = _signature;
    agreements[_id].state = AgreementState(1);
  }

  function splitSignature(bytes memory _sig) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
    require(_sig.length == 65);
    assembly {
        // first 32 bytes, after the length prefix.
        r := mload(add(_sig, 32))
        // second 32 bytes.
        s := mload(add(_sig, 64))
        // final byte (first byte of the next 32 bytes).
        v := byte(0, mload(add(_sig, 96)))
    }
    if (v < 27) {
      v += 27;
    }

    require (v == 27 || v == 28);
    return (v, r, s);
  }

  function recoverSigner(bytes32 _message, bytes memory _sig) internal pure returns (address) {
    (uint8 v, bytes32 r, bytes32 s) = splitSignature(_sig);
    return ecrecover(_message, v, r, s);
  }

  function payForUsage(uint _id, uint _timestamp) payable public {
    //todo: check _timestamp to be in the past!
    require(_id < agreements.length);
    RentalAgreement memory rentalAgreement = agreements[_id];
    //rentalAgreement must be accepted (and therefore signed) by sender
    require(recoverSigner(getRentalAgreementHash(_id), rentalAgreement.tenantSignature) == msg.sender);
    require(msg.sender == rentalAgreement.tenant);
    require(msg.value == rentalAgreement.usageFee);
    require(rentalAgreement.state == AgreementState.Active);
    rentalAgreement.lessor.transfer(msg.value);
    bytes32 paymentHash = getPaymentHash(_timestamp, rentalAgreement.device, msg.sender, msg.value);
    payments[rentalAgreement.lessor][paymentHash] = Payment(_timestamp, rentalAgreement.device, msg.sender, msg.value);
  }

  function getRentalAgreementHash(uint _id) private returns (bytes32) {
    require(_id < agreements.length);
    bytes32 message = keccak256(abi.encodePacked(agreements[_id].tenant, agreements[_id].lessor, agreements[_id].device, agreements[_id].usageFee, agreements[_id].contractTerm));
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    return keccak256(abi.encodePacked(prefix, message));
  }

  function getPaymentHash(uint _timestamp, address _device, address _payer, uint _amount) public view returns (bytes32) {
    bytes32 message = keccak256(abi.encodePacked(_timestamp, _device, _payer, _amount));
    // bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    // return keccak256(abi.encodePacked(prefix, message));
    return message;
  }

  function checkUsagePayment(uint _agreementID, bytes32 _paymentHash) public view returns(uint, address, address, uint) {
    require(_agreementID < agreements.length);
    RentalAgreement memory rentalAgreement = agreements[_agreementID];
    require(msg.sender == rentalAgreement.device);
    return (payments[rentalAgreement.lessor][_paymentHash].timestamp, payments[rentalAgreement.lessor][_paymentHash].device, payments[rentalAgreement.lessor][_paymentHash].payer, payments[rentalAgreement.lessor][_paymentHash].amount);
  }

  function terminate(uint _agreementID) public {
    require(_agreementID < agreements.length);
    RentalAgreement memory rentalAgreement = agreements[_agreementID];
    require(rentalAgreement.state == AgreementState.Active);
    require(msg.sender == rentalAgreement.tenant || msg.sender == rentalAgreement.lessor);
    agreements[_agreementID].state = AgreementState.Terminated;
  }

}
