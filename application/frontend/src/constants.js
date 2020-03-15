import Web3 from 'web3'
export const ETH_EUR = 196.04;
// export const EUR_ETH = 0.0051;
export const EUR_ETH = 1 / 196.04;

// export const PROVIDER = new Web3.providers.HttpProvider("https://kovan.infura.io/v3/cd8cc67ea2c34b49ac1d9e52b6b3de2b");
export const PROVIDER = window.ethereum;
