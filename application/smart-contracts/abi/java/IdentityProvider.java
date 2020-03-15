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
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
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
public class IdentityProvider extends Contract {
    public static final String BINARY = "608060405234801561001057600080fd5b50600080546001600160a01b0319908116339081179091161790556112c98061003a6000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80639cf1b907116100a2578063aff93e0711610071578063aff93e07146104a1578063cc786534146104a9578063f2fde38b146104cf578063f3e9106d146104f5578063f5a4a8ae146104fd57610116565b80639cf1b9071461035e578063a212b454146103b6578063a8d29d1d146103be578063aed27cc7146103e457610116565b80634eb0469c116100e95780634eb0469c146101a75780636bfd4def14610242578063716890a51461027a5780638b0e6b0e146102a05780638da5cb5b1461035657610116565b806312cbf1321461011b5780633412a15c1461015d57806338cc4831146101795780634d221b8514610181575b600080fd5b6101416004803603602081101561013157600080fd5b50356001600160a01b0316610505565b604080516001600160a01b039092168252519081900360200190f35b61016561052e565b604080519115158252519081900360200190f35b610141610534565b6101656004803603602081101561019757600080fd5b50356001600160a01b0316610538565b6101cd600480360360208110156101bd57600080fd5b50356001600160a01b0316610573565b6040805160208082528351818301528351919283929083019185019080838360005b838110156102075781810151838201526020016101ef565b50505050905090810190601f1680156102345780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102686004803603602081101561025857600080fd5b50356001600160a01b03166106e6565b60408051918252519081900360200190f35b6101cd6004803603602081101561029057600080fd5b50356001600160a01b0316610716565b610354600480360360608110156102b657600080fd5b8101906020810181356401000000008111156102d157600080fd5b8201836020820111156102e357600080fd5b8035906020019184600183028401116401000000008311171561030557600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092955050823593505050602001356001600160a01b03166107c0565b005b610141610ab8565b610366610ac7565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156103a257818101518382015260200161038a565b505050509050019250505060405180910390f35b610354610b29565b610165600480360360208110156103d457600080fd5b50356001600160a01b0316610d51565b610354600480360360808110156103fa57600080fd5b81019060208101813564010000000081111561041557600080fd5b82018360208201111561042757600080fd5b8035906020019184600183028401116401000000008311171561044957600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295505082359350506001600160a01b03602083013581169260400135169050610e6c565b610366610ffd565b610268600480360360208110156104bf57600080fd5b50356001600160a01b031661105d565b610354600480360360208110156104e557600080fd5b50356001600160a01b031661107c565b610366611101565b610366611161565b6001600160a01b038082166000908152600160205260409020600201546101009004165b919050565b60015b90565b3090565b6001600160a01b038116600090815260016020526040812060020154600160a81b900460ff161561056b57506001610529565b506000610529565b6001600160a01b03811660009081526001602081905260409091206002015460609160ff909116908160058111156105a757fe5b14156105d757505060408051808201909152600c81526b26b0b73ab330b1ba3ab932b960a11b6020820152610529565b60028160058111156105e557fe5b141561061157505060408051808201909152600881526721bab9ba37b6b2b960c11b6020820152610529565b600381600581111561061f57fe5b141561065257505060408051808201909152600f81526e29b2b93b34b1b2a83937bb34b232b960891b6020820152610529565b600481600581111561066057fe5b141561068c57505060408051808201909152600881526729bab8383634b2b960c11b6020820152610529565b600581600581111561069a57fe5b14156106c457505060408051808201909152600681526544657669636560d01b6020820152610529565b50506040805180820190915260048152634e6f6e6560e01b6020820152610529565b6001600160a01b03811660009081526001602052604081206002015460ff16600581111561071057fe5b92915050565b6001600160a01b03811660009081526001602081815260409283902080548451600294821615610100026000190190911693909304601f810183900483028401830190945283835260609390918301828280156107b45780601f10610789576101008083540402835291602001916107b4565b820191906000526020600020905b81548152906001019060200180831161079757829003601f168201915b50505050509050919050565b6000546001600160a01b031633146107d757600080fd5b6107e081610538565b156107ea57600080fd5b6000821180156107fb575081600514155b61080457600080fd5b61080c6111c1565b6040518060a0016040528085815260200142815260200184600581111561082f57fe5b600581111561083a57fe5b81526001600160a01b03841660208083018290526001604093840181905260009283528152919020825180519394508493919261087c928492909101906111fb565b506020820151816001015560408201518160020160006101000a81548160ff021916908360058111156108ab57fe5b02179055506060820151600290910180546080909301511515600160a81b0260ff60a81b196001600160a01b0390931661010002610100600160a81b03199094169390931791909116919091179055600183600581111561090857fe5b600581111561091357fe5b141561096957600380546001810182556000919091527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b0180546001600160a01b0319166001600160a01b038416179055610ab2565b600383600581111561097757fe5b600581111561098257fe5b14156109d857600480546001810182556000919091527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b0180546001600160a01b0319166001600160a01b038416179055610ab2565b60048360058111156109e657fe5b60058111156109f157fe5b1415610a4757600580546001810182556000919091527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db00180546001600160a01b0319166001600160a01b038416179055610ab2565b6002836005811115610a5557fe5b6005811115610a6057fe5b14610ab2576040805162461bcd60e51b815260206004820152601760248201527f546869732073686f756c64206e6f742068617070656e2e000000000000000000604482015290519081900360640190fd5b50505050565b6000546001600160a01b031681565b60606004805480602002602001604051908101604052809291908181526020018280548015610b1f57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610b01575b5050505050905090565b6000546001600160a01b03163314610b4057600080fd5b60408051808201909152600c81526b26b0b73ab330b1ba3ab932b960a11b6020820152610b8390600173e3cbf35cd6fadea91c4b9a19882af976725753dd6107c0565b604080518082019091526009815268437573746f6d65723160b81b6020820152610bc39060027337848e7bddbf872093d346f89be9b507edf6462b6107c0565b60408051808201909152600981526821bab9ba37b6b2b91960b91b6020820152610c03906002738ef5906034be23248ef49c38fef9f17265ab044f6107c0565b6040805180820190915260078152664465766963653160c81b6020820152610c5690600573f00c699c96e05f919ee1c57b824a29cc6216352e73e3cbf35cd6fadea91c4b9a19882af976725753dd610e6c565b6040805180820190915260078152662232bb34b1b29960c91b6020820152610ca990600573cf5f7aa0103662ef67cf453f7d4a6bfdff04057e73e3cbf35cd6fadea91c4b9a19882af976725753dd610e6c565b6040805180820190915260078152664465766963653360c81b6020820152610cfc906005734a21c369a3b7f4c56ec4dcbab706c30897cb184573e3cbf35cd6fadea91c4b9a19882af976725753dd610e6c565b60408051808201909152600781526611195d9a58d94d60ca1b6020820152610d4f90600573ea05a247562d4865f6e2a5d9347eeb61c966a21473e3cbf35cd6fadea91c4b9a19882af976725753dd610e6c565b565b600080546001600160a01b03163314610d6957600080fd5b610d7282610538565b1561056b576040805160c081018252600060a082018181528252602080830182905282840182905260608301829052608083018290526001600160a01b0386168252600181529290208151805192939192610dd092849201906111fb565b506020820151816001015560408201518160020160006101000a81548160ff02191690836005811115610dff57fe5b02179055506060820151600290910180546080909301511515600160a81b0260ff60a81b196001600160a01b0390931661010002610100600160a81b03199094169390931791909116919091179055610e5782610538565b15610e6457506000610529565b506001610529565b6000546001600160a01b03163314610e8357600080fd5b610e8c82610538565b15610e9657600080fd5b610e9f81610538565b610ea857600080fd5b82600514610eb557600080fd5b610ebd6111c1565b6040518060a00160405280868152602001428152602001856005811115610ee057fe5b6005811115610eeb57fe5b81526001600160a01b038085166020808401919091526001604093840181905291871660009081529181529190208251805193945084939192610f33928492909101906111fb565b506020820151816001015560408201518160020160006101000a81548160ff02191690836005811115610f6257fe5b0217905550606082015160029182018054608090940151610100600160a81b03199094166101006001600160a01b03938416021760ff60a81b1916600160a81b941515949094029390931790925580546001810182556000919091527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace0180546001600160a01b031916949091169390931790925550505050565b60606005805480602002602001604051908101604052809291908181526020018280548015610b1f576020028201919060005260206000209081546001600160a01b03168152600190910190602001808311610b01575050505050905090565b6001600160a01b03166000908152600160208190526040909120015490565b6000546001600160a01b0316331461109357600080fd5b6001600160a01b0381166110a657600080fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b60606002805480602002602001604051908101604052809291908181526020018280548015610b1f576020028201919060005260206000209081546001600160a01b03168152600190910190602001808311610b01575050505050905090565b60606003805480602002602001604051908101604052809291908181526020018280548015610b1f576020028201919060005260206000209081546001600160a01b03168152600190910190602001808311610b01575050505050905090565b6040518060a001604052806060815260200160008152602001600060058111156111e757fe5b815260006020820181905260409091015290565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061123c57805160ff1916838001178555611269565b82800160010185558215611269579182015b8281111561126957825182559160200191906001019061124e565b50611275929150611279565b5090565b61053191905b80821115611275576000815560010161127f56fea264697066735822122028c97169da086eba9dcd97c0fc66b29cc5224bb732a6e2ea7ace720ef5dd3cb064736f6c63430006030033";

    public static final String FUNC_ADDIDENTITY = "addIdentity";

    public static final String FUNC_ADDIDENTITYOWNEDBY = "addIdentityOwnedBy";

    public static final String FUNC_ADDTESTDATA = "addTestData";

    public static final String FUNC_DELETEIDENTITY = "deleteIdentity";

    public static final String FUNC_GETADDRESS = "getAddress";

    public static final String FUNC_GETIDENTITYCREATIONTIME = "getIdentityCreationTime";

    public static final String FUNC_GETIDENTITYNAME = "getIdentityName";

    public static final String FUNC_GETIDENTITYOWNER = "getIdentityOwner";

    public static final String FUNC_GETIDENTITYROLE = "getIdentityRole";

    public static final String FUNC_GETIDENTITYROLENAME = "getIdentityRoleName";

    public static final String FUNC_GETKNOWNDEVICES = "getKnownDevices";

    public static final String FUNC_GETKNOWNMANUFACTURERS = "getKnownManufacturers";

    public static final String FUNC_GETKNOWNSERVICEPROVIDERS = "getKnownServiceProviders";

    public static final String FUNC_GETKNOWNSUPPLIERS = "getKnownSuppliers";

    public static final String FUNC_IDENTITYEXISTS = "identityExists";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_TESTCONNECTION = "testConnection";

    public static final String FUNC_TRANSFEROWNERSHIP = "transferOwnership";

    public static final Event OWNERSHIPTRANSFERRED_EVENT = new Event("OwnershipTransferred", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}));
    ;

    @Deprecated
    protected IdentityProvider(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected IdentityProvider(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected IdentityProvider(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected IdentityProvider(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
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

    public RemoteFunctionCall<TransactionReceipt> addIdentity(String _name, BigInteger _roleID, String _identity) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_ADDIDENTITY, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_name), 
                new org.web3j.abi.datatypes.generated.Uint256(_roleID), 
                new org.web3j.abi.datatypes.Address(160, _identity)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> addIdentityOwnedBy(String _name, BigInteger _roleID, String _identity, String _owner) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_ADDIDENTITYOWNEDBY, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_name), 
                new org.web3j.abi.datatypes.generated.Uint256(_roleID), 
                new org.web3j.abi.datatypes.Address(160, _identity), 
                new org.web3j.abi.datatypes.Address(160, _owner)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> addTestData() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_ADDTESTDATA, 
                Arrays.<Type>asList(), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> deleteIdentity(String _identity) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_DELETEIDENTITY, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _identity)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<String> getAddress() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETADDRESS, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<BigInteger> getIdentityCreationTime(String _identity) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETIDENTITYCREATIONTIME, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _identity)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<String> getIdentityName(String _identity) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETIDENTITYNAME, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _identity)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<String> getIdentityOwner(String _identity) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETIDENTITYOWNER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _identity)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<BigInteger> getIdentityRole(String _identity) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETIDENTITYROLE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _identity)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<String> getIdentityRoleName(String _identity) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETIDENTITYROLENAME, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _identity)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<List> getKnownDevices() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETKNOWNDEVICES, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Address>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    public RemoteFunctionCall<List> getKnownManufacturers() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETKNOWNMANUFACTURERS, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Address>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    public RemoteFunctionCall<List> getKnownServiceProviders() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETKNOWNSERVICEPROVIDERS, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Address>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    public RemoteFunctionCall<List> getKnownSuppliers() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_GETKNOWNSUPPLIERS, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Address>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    public RemoteFunctionCall<Boolean> identityExists(String _identity) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_IDENTITYEXISTS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _identity)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<String> owner() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_OWNER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<Boolean> testConnection() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_TESTCONNECTION, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<TransactionReceipt> transferOwnership(String newOwner) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_TRANSFEROWNERSHIP, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, newOwner)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static IdentityProvider load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new IdentityProvider(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static IdentityProvider load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new IdentityProvider(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static IdentityProvider load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new IdentityProvider(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static IdentityProvider load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new IdentityProvider(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<IdentityProvider> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(IdentityProvider.class, web3j, credentials, contractGasProvider, BINARY, "");
    }

    public static RemoteCall<IdentityProvider> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(IdentityProvider.class, web3j, transactionManager, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<IdentityProvider> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(IdentityProvider.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<IdentityProvider> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(IdentityProvider.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }

    public static class OwnershipTransferredEventResponse extends BaseEventResponse {
        public String previousOwner;

        public String newOwner;
    }
}
