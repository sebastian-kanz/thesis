import Web3 from 'web3'
import { isNullOrUndefined } from "util";
import { IDENTITY_CONTRACT_ADDR } from './IdentityManager';
import IdentityManager from './IdentityManager';

export const RENTAL_CONTRACT_ADDR = '0x0fBBe45906B3e122021487d35310BD0351E57ce6';
export const RENTAL_CONTRACT_ABI =
[
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			}
		],
		"name": "accept",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_tenant",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "_lessorSignature",
				"type": "bytes"
			},
			{
				"internalType": "address",
				"name": "_device",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_usageFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_contractTerm",
				"type": "uint256"
			}
		],
		"name": "createRenting",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_device",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_term",
				"type": "uint256"
			}
		],
		"name": "createRequest",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "destroy",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getByID",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stateID",
				"type": "uint256"
			}
		],
		"name": "getIDs",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getIncomingPaymentHashes",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getOutgoingPaymentHashes",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_paymentHash",
				"type": "bytes32"
			}
		],
		"name": "getPayment",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_device",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_payer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "_agreementHash",
				"type": "bytes32"
			}
		],
		"name": "getPaymentHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getRentableDevices",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getRentalAgreementHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "init",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_roleID",
				"type": "uint256"
			}
		],
		"name": "isKnownParticipant",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_timestamp",
				"type": "uint256"
			}
		],
		"name": "payForUsage",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "registerIdentityOracle",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_agreementID",
				"type": "uint256"
			}
		],
		"name": "terminate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_tenant",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_lessor",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_device",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_fee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_term",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_sig",
				"type": "bytes"
			},
			{
				"internalType": "address",
				"name": "_signer",
				"type": "address"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

export default class RentalManager {

	constructor(account) {
		this.account = account;
		this.web3 = new Web3(window.web3.currentProvider);
		this.RentalContract = new this.web3.eth.Contract(RENTAL_CONTRACT_ABI, RENTAL_CONTRACT_ADDR, {
			from: account,
			gasPrice: '4700000'
		});
	}

  async init() {

  }

	async pay(timestamp, device, payer, receiver, amount, id) {
		let paymentHash = await this.RentalContract.methods.calcPaymentHash(timestamp, device, payer, receiver, amount);
		await this.RentalContract.methods.payForUsage(id,timestamp).send({value: amount});
	}

	async calcPaymentHash(timestamp, device, payer, receiver, amount) {
		return await this.web3.utils.soliditySha3(timestamp,device,payer,receiver,amount);
	}

	async getPaymentsByAgreementID(id) {
		let paymentHashes = await this.RentalContract.methods.getOutgoingPaymentHashes().call();
		let agreementHash = await this.RentalContract.methods.getRentalAgreementHash(id).call();
		let payments = new Array();
		for(const hash of paymentHashes) {
			let payment = await this.RentalContract.methods.getPayment(hash).call();
			console.log(payment);
			// if(payment)
		}
	}

	async acceptRentalAgreement(tenant,lessor,device,usageFee,contractTerm,id) {
	// async acceptRentalAgreement(id) {
		let agreementHash = await this.web3.utils.soliditySha3(tenant,lessor,device,usageFee,contractTerm);
		// let agreementHash = await this.web3.utils.soliditySha3("0xFF3904784BeF847991C7705Eef89164A32F31A19","0x6Aa031Ecb47018c081ae968FE157cB9f74a584fD","0xbB8f0d80e1B66e71629D47AB547042E5004F39Df",'10000000000000000','1589255236');
		let signature = await this.web3.eth.personal.sign(agreementHash, this.account);
		await this.RentalContract.methods.accept(id, signature).send();
	}

	async getRentalAgreementIDs() {
    let pendingIDs = await this.RentalContract.methods.getIDs(0).call();
		console.log(pendingIDs);
    let activeIDs = await this.RentalContract.methods.getIDs(1).call();
    let terminatedIDs = await this.RentalContract.methods.getIDs(2).call();
		return { "Pending": pendingIDs, "Active": activeIDs, "Terminated": terminatedIDs };
  }

	async getPendingAgreements() {
		return this.getAgreementsByStateID(0);
	}

	async getActiveAgreements() {
		return this.getAgreementsByStateID(1);
	}

	async getTerminatedAgreements() {
		return this.getAgreementsByStateID(2);
	}

	async getAgreementsByStateID(stateID) {
		let ids = await this.RentalContract.methods.getIDs(stateID).call();
		let agreements = new Array();
	  for (const id of ids) {
	   const agreement = await this.RentalContract.methods.getByID(id).call();
		 agreement[9]=id;
		 agreements.push(agreement);
	  }
		return agreements;
	}

	async getRentableDevices() {
		return await this.RentalContract.methods.getRentableDevices().call();
	}

	async addTestData() {
    let tenant1 = "0xFF3904784BeF847991C7705Eef89164A32F31A19";
    let tenant2 = "0x87deeC84694929a63Aa8ccA01dE58eEA0a6A0e8b";
    let lessor = "0x6Aa031Ecb47018c081ae968FE157cB9f74a584fD";
    let device1 = "0xbB8f0d80e1B66e71629D47AB547042E5004F39Df";
    let device2 = "0x6A7b417aC5A2e20b47fa7717963ce24068B2b3c9";
    let device3 = "0x0fd6f673BC51400B5022eeF84c4a87EBA7D4ac29";
    let device4 = "0x158A17F73c8ca58f929B0cbAF0434Dd02a8cC159";
    let fee = '10000000000000000';
    let term = 1589255236;
		// let hash1 = this.web3.utils.soliditySha3(tenant1,lessor,device1,fee,term);
		// let hash2 = this.web3.utils.soliditySha3(tenant1,lessor,device2,fee,term);
		// let hash3 = this.web3.utils.soliditySha3(tenant2,lessor,device3,fee,term);
		// let hash4 = this.web3.utils.soliditySha3(tenant2,lessor,device4,fee,term);
		// let signature1 = await this.web3.eth.personal.sign(hash1, this.account);
		// let signature2 = await this.web3.eth.personal.sign(hash2, this.account);
		// let signature3 = await this.web3.eth.personal.sign(hash3, this.account);
		// let signature4 = await this.web3.eth.personal.sign(hash4, this.account);
		// let result1 = await this.RentalContract.methods.verify(tenant1, lessor, device1, fee, term, signature1, this.account).call();
		// let result2 = await this.RentalContract.methods.verify(tenant1, lessor, device2, fee, term, signature2, this.account).call();
		// let result3 = await this.RentalContract.methods.verify(tenant2, lessor, device3, fee, term, signature3, this.account).call();
		// let result4 = await this.RentalContract.methods.verify(tenant2, lessor, device4, fee, term, signature4, this.account).call();
		// console.log(signature1);
		// console.log(signature2);
		// console.log(signature3);
		// console.log(signature4);
		let signature1 = "0xabba693fdacb2bbe6241dcd0d28a644f4da3e0ea57bfd4121fcd09fb371284a75cd4b3a78f9ff86b47eb6583175fdb711dc3a8d3e127bccfab9e4053f9e107ea1b";
		let signature2 = "0x2a1187601a6b8a9fffa71be8094c1d8561fdb37e0ba60283b39055c736467d404a2146d2fcc0c6c88b043db20abf01f78b582dc5d132244a7602dbaa442183b81b";
		let signature3 = "0x818a0d6a8e6cb762d82cdde4d692038096d241628e8e491905b2fbb637f131261e96f7f9cfa7b0e52565ca28fad8a2e0a321dafac444109e673eaacd30dfb3d21b";
		let signature4 = "0xb5db6f6cd51bf2680e92995660ec041d938af3a7c2b585fd8b3f7312fedb5b4f1a46c908c4cc771cd6ecc68bbf57e2b826f3e1f7b3936247f457ae990381e15c1b";
	  let result1 = await this.RentalContract.methods.createRenting(tenant1, signature1, device1, fee, term).send();
	  let result2 = await this.RentalContract.methods.createRenting(tenant1, signature2, device2, fee, term).send();
	  let result3 = await this.RentalContract.methods.createRenting(tenant2, signature3, device3, fee, term).send();
		// let result4 = await this.RentalContract.methods.createRenting(tenant2, signature4, device4, fee, term).send();
		console.log(result1);
		// console.log(result2);
		// console.log(result3);
		// console.log(result4);
	}


}


// const domain = [
//     { name: "name", type: "string" },
//     { name: "version", type: "string" },
//     { name: "chainId", type: "uint256" },
//     { name: "verifyingContract", type: "address" },
//     { name: "salt", type: "bytes32" },
// ];
//
// const rentalSignatureObject = [
//     { name: "tenant", type: "address" },
//     { name: "lessor", type: "address" },
//     { name: "device", type: "address" },
//     { name: "fee", type: "uint256" },
//     { name: "term", type: "uint256" },
// ];
//
// const domainData = {
//   name: "Device Rental",
//   version: "1",
//   chainId: 1579447585291,
//   verifyingContract: RENTAL_CONTRACT_ADDR,
//   salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558"
// };
//
// var message = {
//     tenant: "0x57Ce662Ef0d719bB1D43aA3A6140A98e0c9D6b2C",
//     lessor: "0xed62d9d8a84B23d7aF1714F1ea9647b572767834",
//     device: "0xcFce6D1Ec1647A7867AD922ecDd57e12bbfE1885",
//     fee: 100,
//     term: 1589255236
// };
//
// const data = JSON.stringify({
//     types: {
//         EIP712Domain: domain,
//         RentalSignatureObject: rentalSignatureObject,
//     },
//     domain: domainData,
//     primaryType: "RentalSignatureObject",
//     message: message
// });
//
// let signer = this.web3.utils.toChecksumAddress(this.account);
// let contract = this.RentalContract;
// let innerWeb3 = this.web3;
// console.log(data);
// let temp = await this.web3.currentProvider.send(
//   {
//     method: "eth_signTypedData_v3",
//     params: [signer, data],
//     from: signer
//   },
//   async function(err, result) {
//     if (err || result.error) {
//       return console.error(result);
//     } else {
// 			let signature = result.result;
// 			console.log(signature);
//
// 		}
// });
