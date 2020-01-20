import Web3 from 'web3'
import { isNullOrUndefined } from "util";
import IdentityManager from './IdentityManager';

export const RENTAL_CONTRACT_ADDR = '0xBe94bfe389406e3C12874EAC6Be2613ca8B9D7E4';
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
		"constant": true,
		"inputs": [],
		"name": "DOMAIN_SEPARATOR",
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
		"name": "EIP712DOMAIN_TYPEHASH",
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
		"name": "RENTALSIGNATUREOBJECT_TYPEHASH",
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
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_agreementID",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "_paymentHash",
				"type": "bytes32"
			}
		],
		"name": "checkUsagePayment",
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
				"internalType": "address payable",
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
				"name": "_tenant",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "_tenantSignature",
				"type": "bytes"
			},
			{
				"internalType": "address",
				"name": "_lessor",
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
			},
			{
				"internalType": "uint256",
				"name": "_state",
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
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
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
		"name": "verify2",
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
		await this.RentalContract.methods.registerIdentityOracle(IdentityManager.IDENTITY_CONTRACT_ADDR);
  }


  async getRentalAgreementIDs() {
    let pendingIDs = await this.RentalContract.methods.getIDs(0).call();
    let activeIDs = await this.RentalContract.methods.getIDs(1).call();
    let terminatedIDs = await this.RentalContract.methods.getIDs(2).call();
		return { "Pending": pendingIDs, "Active": activeIDs, "Terminated": terminatedIDs };
  }

	async addTestData() {

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
		// 			console.log(result.result);
		//
		// 			let signature = result.result;
		// 			console.log(result);
		//
		// 		}
		// });
    let tenant = "0x57Ce662Ef0d719bB1D43aA3A6140A98e0c9D6b2C";
    let lessor = "0xed62d9d8a84B23d7aF1714F1ea9647b572767834";
    let device = "0xcFce6D1Ec1647A7867AD922ecDd57e12bbfE1885";
    let fee = 1;
    let term = 1589255236;


		let hash = this.web3.utils.soliditySha3(tenant,lessor,device,fee,term);
		console.log(hash);
		// hash = await this.web3.utils.keccak256(this.web3.eth.abi.encodeParameters(
		// 	[ "address", "address", "address", "uint256", "uint256" ],
		// 	[ tenant, lessor, device, fee, term ],
		// ));
		console.log(hash);
		let signature = await this.web3.eth.personal.sign(hash, this.account);
		console.log(signature);


		let result = await this.RentalContract.methods.verify2(tenant, lessor, device, fee, term, signature, this.account).call();
		console.log(result);
	}


}
