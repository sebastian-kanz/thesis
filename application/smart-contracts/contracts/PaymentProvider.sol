pragma solidity >= 0.5.0 < 0.7.0;
import "./Ownable.sol";

/// @notice https://programtheblockchain.com/posts/2018/02/23/writing-a-simple-payment-channel/

contract PaymentProvider is Ownable {

  struct PaymentAgreement {
    address payable sender;
    address payable receiver;
    uint256 balance;
    uint256 numPayments;
    mapping(bytes32 => bool) usedSignatures;
    mapping(uint256 => Usage) history;
  }

  struct Usage {
    uint256 timestampStart;
    uint256 timestampEnd;
    uint256 units;
    uint256 cost;
  }

  mapping(bytes32 => PaymentAgreement) private paymentAgreements;

  address private rentalProvider;

  /// @notice sets the rentalProvider address
  /// @dev only callable by owner
  /// @param _addr the address of the rentalProvider
  function registerRentalProvider(address _addr) public onlyOwner {
    rentalProvider = _addr;
  }

  function addPaymentAgreement(bytes32 _hash, address payable _receiver, address payable _sender) public {
    PaymentAgreement memory tmp;
    tmp.sender = _sender;
    tmp.receiver = _receiver;
    tmp.balance = 0;
    tmp.numPayments = 0;
    paymentAgreements[_hash] = tmp;
  }

  // The sender can charge the channel
  function charge(bytes32 _hash) public payable {
    require(msg.sender == paymentAgreements[_hash].sender || msg.sender == rentalProvider);
    paymentAgreements[_hash].balance = paymentAgreements[_hash].balance + msg.value;
  }

  function getBalance(bytes32 _hash) public returns (uint256) {
    require(msg.sender == paymentAgreements[_hash].sender || msg.sender == paymentAgreements[_hash].receiver);
    return paymentAgreements[_hash].balance;
  }

  function getPaymentHistory(bytes32 _hash) public view returns(uint256[] memory, uint256[] memory, uint256[] memory, uint256[] memory) {
    uint count = paymentAgreements[_hash].numPayments;
    uint256[] memory timestampsStart = new uint256[](count);
    uint256[] memory timestampEnd = new uint256[](count);
    uint256[] memory units = new uint256[](count);
    uint256[] memory costs = new uint256[](count);
    for (uint i = 0; i<count; i++){
        timestampsStart[i] = paymentAgreements[_hash].history[i].timestampStart;
        timestampEnd[i] = paymentAgreements[_hash].history[i].timestampEnd;
        units[i] = paymentAgreements[_hash].history[i].units;
        costs[i] = paymentAgreements[_hash].history[i].cost;
    }
    return (timestampsStart, timestampEnd, units, costs);
  }


  function empty(bytes32 _hash) public {
    require(msg.sender == paymentAgreements[_hash].receiver || msg.sender == rentalProvider);
    paymentAgreements[_hash].sender.transfer(paymentAgreements[_hash].balance);
    paymentAgreements[_hash].balance = 0;
  }

  // The receiver can pay out his balance by presenting a signed
  // amount from the sender. The receiver will be sent that amount but the channel will stay open.
  // The rest of the balance is kept in the channel and not payed out back to the sender.
  function redeem(bytes32 _hash, uint256 _timestampStart, uint256 _timestampEnd, uint256 _units, uint256 _cost, bytes memory _signature) public {
    bytes32 paymentHash = keccak256(abi.encodePacked(_hash, _timestampStart, _timestampEnd, _units, _cost, _signature));
    require(paymentAgreements[_hash].usedSignatures[paymentHash] == false);
    require(_timestampStart < _timestampEnd);
    require(_cost <= paymentAgreements[_hash].balance);
    require(msg.sender == paymentAgreements[_hash].receiver);
    require(isValidSignature(paymentAgreements[_hash].sender, _timestampStart, _timestampEnd, _units, _cost, _signature));
    uint256 num = paymentAgreements[_hash].numPayments;
    paymentAgreements[_hash].history[num] = Usage(_timestampStart, _timestampEnd, _units, _cost);
    paymentAgreements[_hash].numPayments++;

    paymentAgreements[_hash].receiver.transfer(_cost);
    paymentAgreements[_hash].usedSignatures[paymentHash] = true;
    paymentAgreements[_hash].balance = paymentAgreements[_hash].balance - _cost;
  }

  // The sender can extend the expiration at any time.
  // function extend(uint256 newExpiration) public {
  //   require(msg.sender == sender);
  //   require(newExpiration > expiration);
  //
  //   expiration = newExpiration;
  // }

  // If the timeout is reached without the receiver closing the channel, then
  // the ether is released back to the sender.
  // function claimTimeout() public {
  //   require(now >= expiration);
  //   selfdestruct(sender);
  // }

  //##################Helper###################


  /// @notice gets the address of this contract
  function getAddress() public view returns (address) {
    return address(this);
  }

  function isValidSignature(address _sender, uint256 _timestampStart, uint256 _timestampEnd, uint256 _units, uint256 _cost, bytes memory _signature) internal view returns (bool) {
    bytes32 message = prefixed(keccak256(abi.encodePacked(this, _timestampStart, _timestampEnd, _units, _cost)));

    // Check that the signature is from the payment sender.
    return recoverSigner(message, _signature) == _sender;
  }

  function splitSignature(bytes memory sig) internal pure returns (uint8, bytes32, bytes32) {
    require(sig.length == 65);

    bytes32 r;
    bytes32 s;
    uint8 v;

    assembly {
      // first 32 bytes, after the length prefix
      r := mload(add(sig, 32))
      // second 32 bytes
      s := mload(add(sig, 64))
      // final byte (first byte of the next 32 bytes)
      v := byte(0, mload(add(sig, 96)))
    }
    if (v < 27) {
      v += 27;
    }

    require (v == 27 || v == 28);

    return (v, r, s);
  }

  function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address) {
    uint8 v;
    bytes32 r;
    bytes32 s;

    (v, r, s) = splitSignature(sig);

    return ecrecover(message, v, r, s);
  }

  // Builds a prefixed hash to mimic the behavior of eth_sign.
  function prefixed(bytes32 hash) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
  }
}
