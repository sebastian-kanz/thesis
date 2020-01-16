pragma solidity >= 0.5.0 < 0.7.0;

/// @notice https://programtheblockchain.com/posts/2018/02/23/writing-a-simple-payment-channel/

contract PaymentChannel {
  address payable public sender;     // The account sending payments.
  address payable public receiver;  // The account receiving the payments.
  uint256 public expiration; // Timeout in case the receiver never closes.

  function SimplePaymentChannel(address payable _receiver, uint256 duration) public payable {
    sender = msg.sender;
    receiver = _receiver;
    expiration = now + duration;
  }

  function isValidSignature(uint256 amount, bytes memory signature) internal view returns (bool) {
    bytes32 message = prefixed(keccak256(abi.encodePacked(this, amount)));

    // Check that the signature is from the payment sender.
    return recoverSigner(message, signature) == sender;
  }

  // The receiver can close the channel at any time by presenting a signed
  // amount from the sender. The receiver will be sent that amount, and the
  // remainder will go back to the sender.
  function close(uint256 amount, bytes memory signature) public {
    require(msg.sender == receiver);
    require(isValidSignature(amount, signature));

    receiver.transfer(amount);
    selfdestruct(sender);
  }

  // The sender can extend the expiration at any time.
  function extend(uint256 newExpiration) public {
    require(msg.sender == sender);
    require(newExpiration > expiration);

    expiration = newExpiration;
  }

  // If the timeout is reached without the receiver closing the channel, then
  // the ether is released back to the sender.
  function claimTimeout() public {
    require(now >= expiration);
    selfdestruct(sender);
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
