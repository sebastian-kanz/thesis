package com.classycode.nfchttptun;

import io.reactivex.Flowable;
import io.reactivex.functions.Function;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tuples.generated.Tuple4;
import org.web3j.tuples.generated.Tuple5;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 4.5.15.
 */
@SuppressWarnings("rawtypes")
public class PaymentProvider extends Contract {
    public static final String BINARY = "6080604052600080546001600160a01b03191633179055611022806100256000396000f3fe6080604052600436106100dd5760003560e01c80636a7f745e1161007f5780638e739461116100595780638e7394611461049e57806393143773146104da578063ed61a9111461050d578063f2fde38b14610537576100dd565b80636a7f745e14610435578063879e4b1a1461045f5780638da5cb5b14610489576100dd565b806316cac02a116100bb57806316cac02a146102525780632bb7df801461039f578063357dfebc1461040357806338cc483114610420576100dd565b806303d2107f146100e25780630b761b3f14610128578063161e813714610175575b600080fd5b3480156100ee57600080fd5b5061010c6004803603602081101561010557600080fd5b503561056a565b604080516001600160a01b039092168252519081900360200190f35b34801561013457600080fd5b506101736004803603608081101561014b57600080fd5b508035906001600160a01b0360208201358116916040810135821691606090910135166105ce565b005b34801561018157600080fd5b50610173600480360360e081101561019857600080fd5b8135916020810135916040820135916060810135916080820135919081019060c0810160a08201356401000000008111156101d257600080fd5b8201836020820111156101e457600080fd5b8035906020019184600183028401116401000000008311171561020657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550505090356001600160a01b031691506106609050565b34801561025e57600080fd5b5061027c6004803603602081101561027557600080fd5b50356108e9565b6040518080602001806020018060200180602001858103855289818151815260200191508051906020019060200280838360005b838110156102c85781810151838201526020016102b0565b50505050905001858103845288818151815260200191508051906020019060200280838360005b838110156103075781810151838201526020016102ef565b50505050905001858103835287818151815260200191508051906020019060200280838360005b8381101561034657818101518382015260200161032e565b50505050905001858103825286818151815260200191508051906020019060200280838360005b8381101561038557818101518382015260200161036d565b505050509050019850505050505050505060405180910390f35b3480156103ab57600080fd5b506103c9600480360360208110156103c257600080fd5b5035610acc565b604080516001600160a01b039687168152948616602086015292909416838301526060830152608082019290925290519081900360a00190f35b6101736004803603602081101561041957600080fd5b5035610b0b565b34801561042c57600080fd5b5061010c610b5c565b34801561044157600080fd5b5061010c6004803603602081101561045857600080fd5b5035610b60565b34801561046b57600080fd5b506101736004803603602081101561048257600080fd5b5035610bc7565b34801561049557600080fd5b5061010c610c63565b3480156104aa57600080fd5b506104c8600480360360208110156104c157600080fd5b5035610c72565b60408051918252519081900360200190f35b3480156104e657600080fd5b50610173600480360360208110156104fd57600080fd5b50356001600160a01b0316610cd0565b34801561051957600080fd5b5061010c6004803603602081101561053057600080fd5b5035610d09565b34801561054357600080fd5b506101736004803603602081101561055a57600080fd5b50356001600160a01b0316610d71565b6000818152600160205260408120546001600160a01b03163314806105a95750600082815260016020819052604090912001546001600160a01b031633145b6105b257600080fd5b506000908152600160205260409020546001600160a01b031690565b6105d6610fbe565b6001600160a01b0392831681529282166020808501918252918316604080860191825260006060870181815260808801828152988252600195869052919020955186549086166001600160a01b0319918216178755925193860180549486169484169490941790935551600285018054919094169116179091555160038201559051600490910155565b6000878787878787876040516020018088815260200187815260200186815260200185815260200184815260200183805190602001908083835b602083106106b95780518252601f19909201916020918201910161069a565b6001836020036101000a038019825116818451168082178552505050505050905001826001600160a01b03166001600160a01b031660601b815260140197505050505050505060405160208183030381529060405280519060200120905060016000898152602001908152602001600020600501600082815260200190815260200160002060009054906101000a900460ff161515600015151461075c57600080fd5b85871061076857600080fd5b6000888152600160205260409020600201546001600160a01b0383811691161461079157600080fd5b6000888152600160205260409020600301548411156107af57600080fd5b600088815260016020819052604090912001546001600160a01b031633146107d657600080fd5b6000888152600160205260409020546107fd906001600160a01b0316888888888789610df6565b61080657600080fd5b600088815260016020818152604080842060048101805483516080810185528e81528086018e81528186018e8152606083018e8152848b52600687018952878b20935184559151838a0155516002830155516003909101558e87529385905280548501905590920154915190926001600160a01b039092169187156108fc02918891818181858888f193505050501580156108a5573d6000803e3d6000fd5b505060008881526001602081815260408084209484526005850182528320805460ff1916831790559990915290975250506003909401805494909403909355505050565b606080606080600060016000878152602001908152602001600020600401549050606081604051908082528060200260200182016040528015610936578160200160208202803683370190505b509050606082604051908082528060200260200182016040528015610965578160200160208202803683370190505b509050606083604051908082528060200260200182016040528015610994578160200160208202803683370190505b5090506060846040519080825280602002602001820160405280156109c3578160200160208202803683370190505b50905060005b85811015610abb5760008b815260016020908152604080832084845260060190915290205485518690839081106109fc57fe5b60209081029190910181019190915260008c81526001808352604080832085845260060190935291902001548451859083908110610a3657fe5b60209081029190910181019190915260008c815260018252604080822084835260060190925220600201548351849083908110610a6f57fe5b60209081029190910181019190915260008c815260018252604080822084835260060190925220600301548251839083908110610aa857fe5b60209081029190910101526001016109c9565b509299919850965090945092505050565b6001602081905260009182526040909120805491810154600282015460038301546004909301546001600160a01b039485169492831693919092169185565b6000818152600160205260409020546001600160a01b0316331480610b3a57506002546001600160a01b031633145b610b4357600080fd5b6000908152600160205260409020600301805434019055565b3090565b6000818152600160205260408120546001600160a01b0316331480610b9f5750600082815260016020819052604090912001546001600160a01b031633145b610ba857600080fd5b506000908152600160205260409020600201546001600160a01b031690565b600081815260016020819052604090912001546001600160a01b0316331480610bfa57506002546001600160a01b031633145b610c0357600080fd5b600081815260016020526040808220805460039091015491516001600160a01b039091169282156108fc02929190818181858888f19350505050158015610c4e573d6000803e3d6000fd5b50600090815260016020526040812060030155565b6000546001600160a01b031681565b6000818152600160205260408120546001600160a01b0316331480610cb15750600082815260016020819052604090912001546001600160a01b031633145b610cba57600080fd5b5060009081526001602052604090206003015490565b6000546001600160a01b03163314610ce757600080fd5b600280546001600160a01b0319166001600160a01b0392909216919091179055565b6000818152600160205260408120546001600160a01b0316331480610d485750600082815260016020819052604090912001546001600160a01b031633145b610d5157600080fd5b50600090815260016020819052604090912001546001600160a01b031690565b6000546001600160a01b03163314610d8857600080fd5b6001600160a01b038116610d9b57600080fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b6040805130606090811b602080840191909152603483018a90526054830189905260748301889052609483018790529085901b6bffffffffffffffffffffffff191660b4830152825180830360a801815260c890920190925280519101206000908190610e6290610e8f565b9050886001600160a01b0316610e788285610ee0565b6001600160a01b0316149998505050505050505050565b604080517f19457468657265756d205369676e6564204d6573736167653a0a333200000000602080830191909152603c8083019490945282518083039094018452605c909101909152815191012090565b600080600080610eef85610f63565b604080516000815260208082018084528c905260ff8616828401526060820185905260808201849052915194975092955090935060019260a080840193601f198301929081900390910190855afa158015610f4e573d6000803e3d6000fd5b5050604051601f190151979650505050505050565b60008060008351604114610f7657600080fd5b60208401516040850151606086015160001a601b811015610f9557601b015b8060ff16601b1480610faa57508060ff16601c145b610fb357600080fd5b969195509350915050565b6040805160a0810182526000808252602082018190529181018290526060810182905260808101919091529056fea26469706673582212203e2b662e93d00e4e49cda00fcb9f7826b31ddea3dba1ca4006b31a67ea60bb2764736f6c63430006030033";

    public static final String FUNC_ADDPAYMENTAGREEMENT = "addPaymentAgreement";

    public static final String FUNC_CHARGE = "charge";

    public static final String FUNC_EMPTY = "empty";

    public static final String FUNC_GETADDRESS = "getAddress";

    public static final String FUNC_GETBALANCE = "getBalance";

    public static final String FUNC_GETDEVICE = "getDevice";

    public static final String FUNC_GETPAYMENTHISTORY = "getPaymentHistory";

    public static final String FUNC_GETRECEIVER = "getReceiver";

    public static final String FUNC_GETSENDER = "getSender";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_PAYMENTAGREEMENTS = "paymentAgreements";

    public static final String FUNC_REDEEM = "redeem";

    public static final String FUNC_REGISTERRENTALPROVIDER = "registerRentalProvider";

    public static final String FUNC_TRANSFEROWNERSHIP = "transferOwnership";

    public static final Event OWNERSHIPTRANSFERRED_EVENT = new Event("OwnershipTransferred", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}));
    ;

    @Deprecated
    protected PaymentProvider(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected PaymentProvider(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected PaymentProvider(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected PaymentProvider(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public List<OwnershipTransferredEventResponse> getOwnershipTransferredEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(OWNERSHIPTRANSFERRED_EVENT, transactionReceipt);
        ArrayList<OwnershipTransferredEventResponse> responses = new ArrayList<OwnershipTransferredEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            OwnershipTransferredEventResponse typedResponse = new OwnershipTransferredEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.previousOwner = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.newOwner = (String) eventValues.getIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<OwnershipTransferredEventResponse> ownershipTransferredEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, OwnershipTransferredEventResponse>() {
            @Override
            public OwnershipTransferredEventResponse apply(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(OWNERSHIPTRANSFERRED_EVENT, log);
                OwnershipTransferredEventResponse typedResponse = new OwnershipTransferredEventResponse();
                typedResponse.log = log;
                typedResponse.previousOwner = (String) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.newOwner = (String) eventValues.getIndexedValues().get(1).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<OwnershipTransferredEventResponse> ownershipTransferredEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(OWNERSHIPTRANSFERRED_EVENT));
        return ownershipTransferredEventFlowable(filter);
    }

    public RemoteFunctionCall<TransactionReceipt> addPaymentAgreement(byte[] _hash, String _receiver, String _sender, String _device) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_ADDPAYMENTAGREEMENT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(_hash), 
                new org.web3j.abi.datatypes.Address(160, _receiver), 
                new org.web3j.abi.datatypes.Address(160, _sender), 
                new org.web3j.abi.datatypes.Address(160, _device)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> charge(byte[] _hash) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_CHARGE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(_hash)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> empty(byte[] _hash) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_EMPTY, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(_hash)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<String> getAddress() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETADDRESS, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<TransactionReceipt> getBalance(byte[] _hash) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETBALANCE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(_hash)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getDevice(byte[] _hash) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETDEVICE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(_hash)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Tuple4<List<BigInteger>, List<BigInteger>, List<BigInteger>, List<BigInteger>>> getPaymentHistory(byte[] _hash) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETPAYMENTHISTORY, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(_hash)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Uint256>>() {}, new TypeReference<DynamicArray<Uint256>>() {}, new TypeReference<DynamicArray<Uint256>>() {}, new TypeReference<DynamicArray<Uint256>>() {}));
        return new RemoteFunctionCall<Tuple4<List<BigInteger>, List<BigInteger>, List<BigInteger>, List<BigInteger>>>(function,
                new Callable<Tuple4<List<BigInteger>, List<BigInteger>, List<BigInteger>, List<BigInteger>>>() {
                    @Override
                    public Tuple4<List<BigInteger>, List<BigInteger>, List<BigInteger>, List<BigInteger>> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple4<List<BigInteger>, List<BigInteger>, List<BigInteger>, List<BigInteger>>(
                                convertToNative((List<Uint256>) results.get(0).getValue()), 
                                convertToNative((List<Uint256>) results.get(1).getValue()), 
                                convertToNative((List<Uint256>) results.get(2).getValue()), 
                                convertToNative((List<Uint256>) results.get(3).getValue()));
                    }
                });
    }

    public RemoteFunctionCall<TransactionReceipt> getReceiver(byte[] _hash) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETRECEIVER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(_hash)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> getSender(byte[] _hash) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_GETSENDER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(_hash)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<String> owner() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_OWNER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<Tuple5<String, String, String, BigInteger, BigInteger>> paymentAgreements(byte[] param0) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_PAYMENTAGREEMENTS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(param0)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}, new TypeReference<Address>() {}, new TypeReference<Address>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}));
        return new RemoteFunctionCall<Tuple5<String, String, String, BigInteger, BigInteger>>(function,
                new Callable<Tuple5<String, String, String, BigInteger, BigInteger>>() {
                    @Override
                    public Tuple5<String, String, String, BigInteger, BigInteger> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple5<String, String, String, BigInteger, BigInteger>(
                                (String) results.get(0).getValue(), 
                                (String) results.get(1).getValue(), 
                                (String) results.get(2).getValue(), 
                                (BigInteger) results.get(3).getValue(), 
                                (BigInteger) results.get(4).getValue());
                    }
                });
    }

    public RemoteFunctionCall<TransactionReceipt> redeem(byte[] _hash, BigInteger _timestampStart, BigInteger _timestampEnd, BigInteger _units, BigInteger _cost, byte[] _signature, String _device) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_REDEEM, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(_hash), 
                new org.web3j.abi.datatypes.generated.Uint256(_timestampStart), 
                new org.web3j.abi.datatypes.generated.Uint256(_timestampEnd), 
                new org.web3j.abi.datatypes.generated.Uint256(_units), 
                new org.web3j.abi.datatypes.generated.Uint256(_cost), 
                new org.web3j.abi.datatypes.DynamicBytes(_signature), 
                new org.web3j.abi.datatypes.Address(160, _device)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> registerRentalProvider(String _addr) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_REGISTERRENTALPROVIDER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _addr)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> transferOwnership(String newOwner) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_TRANSFEROWNERSHIP, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, newOwner)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static PaymentProvider load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new PaymentProvider(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static PaymentProvider load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new PaymentProvider(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static PaymentProvider load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new PaymentProvider(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static PaymentProvider load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new PaymentProvider(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<PaymentProvider> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(PaymentProvider.class, web3j, credentials, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<PaymentProvider> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(PaymentProvider.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    public static RemoteCall<PaymentProvider> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(PaymentProvider.class, web3j, transactionManager, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<PaymentProvider> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(PaymentProvider.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }

    public static class OwnershipTransferredEventResponse extends BaseEventResponse {
        public String previousOwner;

        public String newOwner;
    }
}
