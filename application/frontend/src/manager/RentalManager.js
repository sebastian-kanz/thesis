import Web3 from 'web3'
import { isNullOrUndefined } from "util";

export const RENTAL_CONTRACT_ADDR = '0x846161ac19de813492fa4641eddaeea529ffd4b6';
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
		"name": "create",
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
	}
]

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


  async getRentalAgreementIDs() {
    let pendingIDs = await this.RentalContract.methods.getIDs(0).call();
    let activeIDs = await this.RentalContract.methods.getIDs(0).call();
    let terminatedIDs = await this.RentalContract.methods.getIDs(0).call();
		return { "Pending": pendingIDs, "Active": activeIDs, "Terminated": terminatedIDs };
  }

	async addTestData() {
		var block = await this.web3.eth.getBlock("latest");
		console.log(block);
		const tenant = "0x5Df79E4f8811e4078f2Ada2a6fE6c7f272B74deE";
		const device = "0xae6d3A28Ee246571608B670f86573a4d2Ea5bDD0";
		const usageFee = 1;
		const contractTerm = Math.round(new Date(new Date().getTime() + 1000 * 60 * 60 * 24).getTime()/1000);
		let signature = await this.web3.eth.sign(this.web3.utils.soliditySha3(tenant,this.account,device, usageFee, contractTerm),this.account);
		let result = await this.RentalContract.methods.create(tenant, signature, device, usageFee, contractTerm).send({gas: 6700000});
		console.log(result);
	}

}
