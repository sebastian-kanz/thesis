pragma solidity >= 0.5.0 < 0.7.0;

import "./IdentityProvider.sol";
import "./PaymentProvider.sol";
import "./Ownable.sol";

contract RentalProvider is Ownable {

  enum AgreementState {
    Pending,
    Active,
    Terminated
  }

  RentalRequest[] public requests;
  RentalAgreement[] public agreements;
  address[] public rentableDevices;

  struct RentalRequest {
    address tenant;
    address lessor;
    address device;
    uint256 contractTerm;
  }

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
    bytes32 paymentAgreementHash;
  }


  address public oracle_addr;
  address public paymentProvider_addr;

  constructor () public {
    owner = msg.sender;
  }

  function init() public onlyOwner {
    IdentityProvider oracle = IdentityProvider(oracle_addr);
    rentableDevices = oracle.getKnownDevices();
  }

  function destroy() public {
    require(msg.sender == owner, "Only owner can call this function.");
    selfdestruct(owner);
  }

  function getRentableDevices() public view returns (address[] memory){
    return rentableDevices;
  }

  function deviceIsRentable(address _device) public view returns (bool) {
    bool found = false;
    for(uint i = 0; i < rentableDevices.length; i++) {
      if(_device == rentableDevices[i]) {
        found = true;
      }
    }
    return found;
  }

  function createRequest(address _device, address _lessor, uint256 _term) public {
    require(isKnownParticipant(msg.sender, 2));
    require(isKnownParticipant(_device, 5));
    require(isKnownParticipant(_lessor, 1));
    require(deviceIsRentable(_device));
    IdentityProvider oracle = IdentityProvider(oracle_addr);
    require(_lessor == oracle.getIdentityOwner(_device));
    require(!agreementExists(msg.sender, _device));
    require(!requestExists(msg.sender, _lessor, _device, _term));
    requests.push(RentalRequest(msg.sender, _lessor, _device, _term));
    removeDeviceFromRentableList(getRentableDeviceListIndex(_device));
  }

  function removeRequest(address _tenant, address _lessor, address _device, uint256 _term) public {
    require(isKnownParticipant(msg.sender, 1));
    require(msg.sender == _lessor);
    require(requestExists(_tenant, _lessor, _device, _term));
    uint index = 0;
    for(uint i = 0; i < requests.length; i++) {
      if(requests[i].tenant == _tenant && requests[i].lessor == _lessor && requests[i].device == _device && requests[i].contractTerm == _term) {
        index = i;
      }
    }
    for (uint i = index; i<requests.length-1; i++){
        requests[i] = requests[i+1];
    }
    requests.pop();
    //delete requests[requests.length-1];
    //requests.length--;
  }

  function getRequestsAsLessor() public view returns(address[] memory, address[] memory, address[] memory, uint256[] memory) {
    require(isKnownParticipant(msg.sender, 1));
    uint count = 0;
    for(uint i = 0; i < requests.length; i++) {
      if(requests[i].lessor == msg.sender) {
        count++;
      }
    }
    address[] memory tenants = new address[](count);
    address[] memory lessors = new address[](count);
    address[] memory devices = new address[](count);
    uint256[] memory terms = new uint256[](count);
    uint index = 0;
    for(uint i = 0; i < requests.length; i++) {
      if(requests[i].lessor == msg.sender) {
        tenants[index] = requests[i].tenant;
        lessors[index] = requests[i].lessor;
        devices[index] = requests[i].device;
        terms[index] = requests[i].contractTerm;
        index++;
      }
    }
    return (tenants, lessors, devices, terms);
  }

  function getRequestsAsTenant() public view returns(address[] memory, address[] memory, address[] memory, uint256[] memory) {
    require(isKnownParticipant(msg.sender, 2));
    uint count = 0;
    for(uint i = 0; i < requests.length; i++) {
      if(requests[i].tenant == msg.sender) {
        count++;
      }
    }
    address[] memory tenants = new address[](count);
    address[] memory lessors = new address[](count);
    address[] memory devices = new address[](count);
    uint256[] memory terms = new uint256[](count);
    uint index = 0;
    for(uint i = 0; i < requests.length; i++) {
      if(requests[i].tenant == msg.sender) {
        tenants[index] = requests[i].tenant;
        lessors[index] = requests[i].lessor;
        devices[index] = requests[i].device;
        terms[index] = requests[i].contractTerm;
        index++;
      }
    }
    return (tenants, lessors, devices, terms);
  }

  function requestExists(address _tenant, address _lessor, address _device, uint256 _term) public view returns (bool){
    for(uint i = 0; i < requests.length; i++) {
      if(requests[i].tenant == _tenant && requests[i].lessor == _lessor && requests[i].device == _device && requests[i].contractTerm == _term ) {
        return true;
      }
    }
    return false;
  }

  function removeDeviceFromRentableList(uint index) public {
    require(index < rentableDevices.length);
    require(index >= 0);
    for (uint i = index; i<rentableDevices.length-1; i++){
        rentableDevices[i] = rentableDevices[i+1];
    }
    rentableDevices.pop();
    //delete rentableDevices[rentableDevices.length-1];
    //rentableDevices.length--;
  }

  function getRentableDeviceListIndex(address _device) public view returns (uint) {
    for(uint i = 0; i < rentableDevices.length; i++) {
      if(_device == rentableDevices[i]) {
        return i;
      }
    }
    revert();
  }

  /// @notice asks registered oracle whether the identity is known or not
  /// @param _addr the address of the identity address
  /// @param _roleID the role of the identity
  /// @return a boolean whether or not the identity is known
  function isKnownParticipant(address _addr, uint _roleID) public view returns(bool) {
      IdentityProvider oracle = IdentityProvider(oracle_addr);
      if(oracle.identityExists(_addr) && oracle.getIdentityRole(_addr) == _roleID) {
        return true;
      } else {
        return false;
      }
  }

  /// @notice sets the oracle address
  /// @dev only callable by owner
  /// @param _addr the address of the orcle
  function registerIdentityProvider(address _addr) public onlyOwner {
    oracle_addr = _addr;
  }

  /// @notice sets the PaymentProvider address
  /// @dev only callable by owner
  /// @param _addr the address of the PaymentProvider
  function registerPaymentProvider(address _addr) public onlyOwner {
    paymentProvider_addr = _addr;
  }

  function verify(address _tenant, address _lessor, address _device, uint256 _fee, uint256 _term, bytes memory _sig, address _signer) public pure returns (bool) {
    (uint8 v, bytes32 r, bytes32 s) = splitSignature(_sig);
    bytes32 hashCalc = keccak256(abi.encodePacked(_tenant,_lessor,_device,_fee,_term));
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    return ecrecover(keccak256(abi.encodePacked(prefix, hashCalc)), v, r, s) == _signer;
  }

  /// @notice creates a rentalAgreement
  /// @param _tenant address of the tenant
  /// @param _lessorSignature signature of lessor of rentalAgreement
  /// @param _device address of device
  /// @param _usageFee fee for usage in wei
  /// @param _contractTerm timestamp, when rentalAgreement times out
  function createRenting(address _tenant, bytes memory _lessorSignature, address _device, uint _usageFee, uint _contractTerm) public {
    require(verify(_tenant, msg.sender, _device, _usageFee, _contractTerm, _lessorSignature, msg.sender));
    //check if sender is Manufacturer, tenant is Customer and device is Device
    require(isKnownParticipant(msg.sender, 1));
    require(isKnownParticipant(_tenant, 2));
    require(isKnownParticipant(_device, 5));
    //check contractTerm to be in future!
    require(_contractTerm > now);
    //check that no rentalAgreement with same parameters exists
    require(!agreementExists(_lessorSignature));


    //already removed by request!
    //removeDeviceFromRentableList(getRentableDeviceListIndex(_device));

    removeRequest(_tenant, msg.sender, _device, _contractTerm);

    bytes32 paymentAgreementHash = keccak256(abi.encodePacked(now, _tenant, msg.sender));
    PaymentProvider paymentProvider = PaymentProvider(paymentProvider_addr);
    paymentProvider.addPaymentAgreement(paymentAgreementHash, msg.sender, address(uint160(_tenant)), _device);

    agreements.push(RentalAgreement(address(uint160(_tenant)), new bytes(65), msg.sender, _lessorSignature, _device, _usageFee, _contractTerm, now, AgreementState.Pending, paymentAgreementHash));
  }

  function agreementExists(bytes memory _lessorSignature) public view returns (bool) {
    for(uint i = 0; i < agreements.length; i++) {
      if(keccak256(agreements[i].lessorSignature) == keccak256(_lessorSignature)) {
        return true;
      }
    }
    return false;
  }

  function agreementExists(address _tenant, address _device) public view returns (bool) {
    require(isKnownParticipant(_tenant, 2));
    require(isKnownParticipant(_device, 5));
    for(uint i = 0; i < agreements.length; i++) {
      if(agreements[i].device == _device && (agreements[i].state == AgreementState.Pending || agreements[i].state == AgreementState.Active)) {
        return true;
      }
    }
    return false;
  }

  function getIDs(uint _stateID) public view returns (uint[] memory) {
    uint count = 0;
    for(uint i = 0; i < agreements.length; i++) {
      if((agreements[i].tenant == msg.sender || agreements[i].lessor == msg.sender) && agreements[i].state == AgreementState(_stateID) ) {
        count++;
      }
    }
    uint[] memory rentalAgreementIDs = new uint[](count);
    uint index = 0;
    for(uint i = 0; i < agreements.length; i++) {
      if((agreements[i].tenant == msg.sender || agreements[i].lessor == msg.sender) && agreements[i].state == AgreementState(_stateID) ) {
        rentalAgreementIDs[index] = i;
        index++;
      }
    }
    return rentalAgreementIDs;
  }

  function getByID(uint _id) public view returns (address, bytes memory, address, bytes memory, address, uint, uint, uint, uint, bytes32) {
    require(_id < agreements.length);
    RentalAgreement memory agreement = agreements[_id];
    require(msg.sender == agreement.tenant || msg.sender == agreement.lessor);
    return (agreement.tenant, agreement.tenantSignature, agreement.lessor, agreement.lessorSignature, agreement.device, agreement.usageFee, agreement.contractTerm, agreement.creation, uint256(agreement.state), agreement.paymentAgreementHash);
  }

  function accept(uint _id, bytes memory _signature) public payable {
    require(_id < agreements.length);
    require(now < agreements[_id].contractTerm);
    require(agreements[_id].state == AgreementState.Pending);
    require(agreements[_id].tenant == msg.sender);
    require(recoverSigner(getRentalAgreementHash(_id), _signature) == msg.sender);
    require(msg.value > 0);
    agreements[_id].tenantSignature = _signature;
    agreements[_id].state = AgreementState(1);
    PaymentProvider paymentProvider = PaymentProvider(paymentProvider_addr);
    paymentProvider.charge.value(msg.value)(agreements[_id].paymentAgreementHash);
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

  function getRentalAgreementHash(uint _id) public view returns (bytes32) {
    require(_id < agreements.length);
    bytes32 message = keccak256(abi.encodePacked(agreements[_id].tenant, agreements[_id].lessor, agreements[_id].device, agreements[_id].usageFee, agreements[_id].contractTerm));
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    return keccak256(abi.encodePacked(prefix, message));
  }

  function terminate(uint _agreementID) public {
    require(_agreementID < agreements.length);
    RentalAgreement memory rentalAgreement = agreements[_agreementID];
    require(rentalAgreement.state == AgreementState.Active);
    require(msg.sender == rentalAgreement.tenant || msg.sender == rentalAgreement.lessor);
    agreements[_agreementID].state = AgreementState.Terminated;

    PaymentProvider paymentProvider = PaymentProvider(paymentProvider_addr);
    paymentProvider.empty(agreements[_agreementID].paymentAgreementHash);

    rentableDevices.push(rentalAgreement.device);
  }

}



  // struct EIP712Domain {
  //     string  name;
  //     string  version;
  //     uint256 chainId;
  //     address verifyingContract;
  //     bytes32 salt;
  // }
  //
  // struct RentalSignatureObject {
  //     address tenant;
  //     address lessor;
  //     address device;
  //     uint256 fee;
  //     uint256 term;
  // }
  //
  // bytes32 constant public EIP712DOMAIN_TYPEHASH = keccak256(
  //     "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)"
  // );
  //
  // bytes32 constant public RENTALSIGNATUREOBJECT_TYPEHASH = keccak256(
  //     "RentalSignatureObject(address tenant,address lessor,address device,uint256 fee,uint256 term)"
  // );
  //
  // bytes32 public DOMAIN_SEPARATOR;

  // constructor () public {
    // DOMAIN_SEPARATOR = hash(EIP712Domain({
    //     name: "Device Rental",
    //     version: '1',
    //     chainId: 1579447585291,
    //     // verifyingContract: this
    //     verifyingContract: address(this),
    //     salt: bytes32(0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558)
    // }));
  // }
  //
  // function hash(EIP712Domain memory eip712Domain) internal pure returns (bytes32) {
  //     return keccak256(abi.encode(
  //         EIP712DOMAIN_TYPEHASH,
  //         keccak256(abi.encodePacked(eip712Domain.name)),
  //         keccak256(abi.encodePacked(eip712Domain.version)),
  //         eip712Domain.chainId,
  //         eip712Domain.verifyingContract,
  //         eip712Domain.salt
  //     ));
  // }
  //
  // function hash(RentalSignatureObject memory _sigObj) internal pure returns (bytes32) {
  //     return keccak256(abi.encode(
  //         RENTALSIGNATUREOBJECT_TYPEHASH,
  //         keccak256(abi.encode(_sigObj.tenant)),
  //         keccak256(abi.encode(_sigObj.lessor)),
  //         keccak256(abi.encode(_sigObj.device)),
  //         keccak256(abi.encode(_sigObj.fee)),
  //         keccak256(abi.encode(_sigObj.term))
  //         // keccak256(bytes(mail.contents))
  //     ));
  // }

  //
  // function verify(address _tenant, address _lessor, address _device, uint256 _fee, uint256 _term, bytes memory _sig, address _signer) public view returns (bool) {
  //   (uint8 v, bytes32 r, bytes32 s) = splitSignature(_sig);
  //   // Note: we need to use `encodePacked` here instead of `encode`.
  //   RentalSignatureObject memory sigObj = RentalSignatureObject(_tenant, _lessor, _device, _fee, _term);
  //   bytes32 digest = keccak256(abi.encodePacked(
  //       "\x19\x01",
  //       DOMAIN_SEPARATOR,
  //       hash(sigObj)
  //   ));
  //   return ecrecover(digest, v, r, s) == _signer;
  // }
