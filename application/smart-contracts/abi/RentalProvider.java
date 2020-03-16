package com.classycode.nfchttptun;

import io.reactivex.Flowable;
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
import org.web3j.abi.datatypes.DynamicBytes;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tuples.generated.Tuple10;
import org.web3j.tuples.generated.Tuple4;
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
public class RentalProvider extends Contract {
    public static final String BINARY = "Bin file was not provided";

    public static final String FUNC_ACCEPT = "accept";

    public static final String FUNC_CREATERENTING = "createRenting";

    public static final String FUNC_CREATEREQUEST = "createRequest";

    public static final String FUNC_DESTROY = "destroy";

    public static final String FUNC_INIT = "init";

    public static final String FUNC_REGISTERIDENTITYPROVIDER = "registerIdentityProvider";

    public static final String FUNC_REMOVEDEVICEFROMRENTABLELIST = "removeDeviceFromRentableList";

    public static final String FUNC_TERMINATE = "terminate";

    public static final String FUNC_REGISTERPAYMENTPROVIDER = "registerPaymentProvider";

    public static final String FUNC_REMOVEREQUEST = "removeRequest";

    public static final String FUNC_TRANSFEROWNERSHIP = "transferOwnership";

    public static final String FUNC_agreementExists = "agreementExists";

    public static final String FUNC_AGREEMENTS = "agreements";

    public static final String FUNC_DEVICEISRENTABLE = "deviceIsRentable";

    public static final String FUNC_GETBYID = "getByID";

    public static final String FUNC_GETIDS = "getIDs";

    public static final String FUNC_GETRENTABLEDEVICELISTINDEX = "getRentableDeviceListIndex";

    public static final String FUNC_GETRENTABLEDEVICES = "getRentableDevices";

    public static final String FUNC_GETRENTALAGREEMENTHASH = "getRentalAgreementHash";

    public static final String FUNC_GETREQUESTSASLESSOR = "getRequestsAsLessor";

    public static final String FUNC_GETREQUESTSASTENANT = "getRequestsAsTenant";

    public static final String FUNC_ISKNOWNPARTICIPANT = "isKnownParticipant";

    public static final String FUNC_ORACLE_ADDR = "oracle_addr";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_PAYMENTPROVIDER_ADDR = "paymentProvider_addr";

    public static final String FUNC_RENTABLEDEVICES = "rentableDevices";

    public static final String FUNC_REQUESTEXISTS = "requestExists";

    public static final String FUNC_REQUESTS = "requests";

    public static final String FUNC_VERIFY = "verify";

    public static final Event OWNERSHIPTRANSFERRED_EVENT = new Event("OwnershipTransferred", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}));
    ;

    @Deprecated
    protected RentalProvider(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected RentalProvider(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected RentalProvider(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected RentalProvider(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public RemoteFunctionCall<TransactionReceipt> accept(BigInteger _id, byte[] _signature) {
        final Function function = new Function(
                FUNC_ACCEPT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_id), 
                new org.web3j.abi.datatypes.DynamicBytes(_signature)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> createRenting(String _tenant, byte[] _lessorSignature, String _device, BigInteger _usageFee, BigInteger _contractTerm) {
        final Function function = new Function(
                FUNC_CREATERENTING, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _tenant), 
                new org.web3j.abi.datatypes.DynamicBytes(_lessorSignature), 
                new org.web3j.abi.datatypes.Address(160, _device), 
                new org.web3j.abi.datatypes.generated.Uint256(_usageFee), 
                new org.web3j.abi.datatypes.generated.Uint256(_contractTerm)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> createRequest(String _device, String _lessor, BigInteger _term) {
        final Function function = new Function(
                FUNC_CREATEREQUEST, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _device), 
                new org.web3j.abi.datatypes.Address(160, _lessor), 
                new org.web3j.abi.datatypes.generated.Uint256(_term)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> destroy() {
        final Function function = new Function(
                FUNC_DESTROY, 
                Arrays.<Type>asList(), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> init() {
        final Function function = new Function(
                FUNC_INIT, 
                Arrays.<Type>asList(), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> registerIdentityProvider(String _addr) {
        final Function function = new Function(
                FUNC_REGISTERIDENTITYPROVIDER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _addr)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> removeDeviceFromRentableList(BigInteger index) {
        final Function function = new Function(
                FUNC_REMOVEDEVICEFROMRENTABLELIST, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(index)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> terminate(BigInteger _agreementID) {
        final Function function = new Function(
                FUNC_TERMINATE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_agreementID)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
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
        return web3j.ethLogFlowable(filter).map(new io.reactivex.functions.Function<Log, OwnershipTransferredEventResponse>() {
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

    public RemoteFunctionCall<TransactionReceipt> registerPaymentProvider(String _addr) {
        final Function function = new Function(
                FUNC_REGISTERPAYMENTPROVIDER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _addr)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> removeRequest(String _tenant, String _lessor, String _device, BigInteger _term) {
        final Function function = new Function(
                FUNC_REMOVEREQUEST, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _tenant), 
                new org.web3j.abi.datatypes.Address(160, _lessor), 
                new org.web3j.abi.datatypes.Address(160, _device), 
                new org.web3j.abi.datatypes.generated.Uint256(_term)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> transferOwnership(String newOwner) {
        final Function function = new Function(
                FUNC_TRANSFEROWNERSHIP, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, newOwner)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Boolean> agreementExists(String _tenant, String _device) {
        final Function function = new Function(FUNC_agreementExists, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _tenant), 
                new org.web3j.abi.datatypes.Address(160, _device)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<Boolean> agreementExists(byte[] _lessorSignature) {
        final Function function = new Function(FUNC_agreementExists, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.DynamicBytes(_lessorSignature)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<Tuple10<String, byte[], String, byte[], String, BigInteger, BigInteger, BigInteger, BigInteger, byte[]>> agreements(BigInteger param0) {
        final Function function = new Function(FUNC_AGREEMENTS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(param0)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}, new TypeReference<DynamicBytes>() {}, new TypeReference<Address>() {}, new TypeReference<DynamicBytes>() {}, new TypeReference<Address>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint8>() {}, new TypeReference<Bytes32>() {}));
        return new RemoteFunctionCall<Tuple10<String, byte[], String, byte[], String, BigInteger, BigInteger, BigInteger, BigInteger, byte[]>>(function,
                new Callable<Tuple10<String, byte[], String, byte[], String, BigInteger, BigInteger, BigInteger, BigInteger, byte[]>>() {
                    @Override
                    public Tuple10<String, byte[], String, byte[], String, BigInteger, BigInteger, BigInteger, BigInteger, byte[]> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple10<String, byte[], String, byte[], String, BigInteger, BigInteger, BigInteger, BigInteger, byte[]>(
                                (String) results.get(0).getValue(), 
                                (byte[]) results.get(1).getValue(), 
                                (String) results.get(2).getValue(), 
                                (byte[]) results.get(3).getValue(), 
                                (String) results.get(4).getValue(), 
                                (BigInteger) results.get(5).getValue(), 
                                (BigInteger) results.get(6).getValue(), 
                                (BigInteger) results.get(7).getValue(), 
                                (BigInteger) results.get(8).getValue(), 
                                (byte[]) results.get(9).getValue());
                    }
                });
    }

    public RemoteFunctionCall<Boolean> deviceIsRentable(String _device) {
        final Function function = new Function(FUNC_DEVICEISRENTABLE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _device)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<Tuple10<String, byte[], String, byte[], String, BigInteger, BigInteger, BigInteger, BigInteger, byte[]>> getByID(BigInteger _id) {
        final Function function = new Function(FUNC_GETBYID, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_id)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}, new TypeReference<DynamicBytes>() {}, new TypeReference<Address>() {}, new TypeReference<DynamicBytes>() {}, new TypeReference<Address>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Bytes32>() {}));
        return new RemoteFunctionCall<Tuple10<String, byte[], String, byte[], String, BigInteger, BigInteger, BigInteger, BigInteger, byte[]>>(function,
                new Callable<Tuple10<String, byte[], String, byte[], String, BigInteger, BigInteger, BigInteger, BigInteger, byte[]>>() {
                    @Override
                    public Tuple10<String, byte[], String, byte[], String, BigInteger, BigInteger, BigInteger, BigInteger, byte[]> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple10<String, byte[], String, byte[], String, BigInteger, BigInteger, BigInteger, BigInteger, byte[]>(
                                (String) results.get(0).getValue(), 
                                (byte[]) results.get(1).getValue(), 
                                (String) results.get(2).getValue(), 
                                (byte[]) results.get(3).getValue(), 
                                (String) results.get(4).getValue(), 
                                (BigInteger) results.get(5).getValue(), 
                                (BigInteger) results.get(6).getValue(), 
                                (BigInteger) results.get(7).getValue(), 
                                (BigInteger) results.get(8).getValue(), 
                                (byte[]) results.get(9).getValue());
                    }
                });
    }

    public RemoteFunctionCall<List> getIDs(BigInteger _stateID) {
        final Function function = new Function(FUNC_GETIDS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_stateID)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Uint256>>() {}));
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

    public RemoteFunctionCall<BigInteger> getRentableDeviceListIndex(String _device) {
        final Function function = new Function(FUNC_GETRENTABLEDEVICELISTINDEX, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _device)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<List> getRentableDevices() {
        final Function function = new Function(FUNC_GETRENTABLEDEVICES, 
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

    public RemoteFunctionCall<byte[]> getRentalAgreementHash(BigInteger _id) {
        final Function function = new Function(FUNC_GETRENTALAGREEMENTHASH, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_id)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<Tuple4<List<String>, List<String>, List<String>, List<BigInteger>>> getRequestsAsLessor() {
        final Function function = new Function(FUNC_GETREQUESTSASLESSOR, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Address>>() {}, new TypeReference<DynamicArray<Address>>() {}, new TypeReference<DynamicArray<Address>>() {}, new TypeReference<DynamicArray<Uint256>>() {}));
        return new RemoteFunctionCall<Tuple4<List<String>, List<String>, List<String>, List<BigInteger>>>(function,
                new Callable<Tuple4<List<String>, List<String>, List<String>, List<BigInteger>>>() {
                    @Override
                    public Tuple4<List<String>, List<String>, List<String>, List<BigInteger>> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple4<List<String>, List<String>, List<String>, List<BigInteger>>(
                                convertToNative((List<Address>) results.get(0).getValue()), 
                                convertToNative((List<Address>) results.get(1).getValue()), 
                                convertToNative((List<Address>) results.get(2).getValue()), 
                                convertToNative((List<Uint256>) results.get(3).getValue()));
                    }
                });
    }

    public RemoteFunctionCall<Tuple4<List<String>, List<String>, List<String>, List<BigInteger>>> getRequestsAsTenant() {
        final Function function = new Function(FUNC_GETREQUESTSASTENANT, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Address>>() {}, new TypeReference<DynamicArray<Address>>() {}, new TypeReference<DynamicArray<Address>>() {}, new TypeReference<DynamicArray<Uint256>>() {}));
        return new RemoteFunctionCall<Tuple4<List<String>, List<String>, List<String>, List<BigInteger>>>(function,
                new Callable<Tuple4<List<String>, List<String>, List<String>, List<BigInteger>>>() {
                    @Override
                    public Tuple4<List<String>, List<String>, List<String>, List<BigInteger>> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple4<List<String>, List<String>, List<String>, List<BigInteger>>(
                                convertToNative((List<Address>) results.get(0).getValue()), 
                                convertToNative((List<Address>) results.get(1).getValue()), 
                                convertToNative((List<Address>) results.get(2).getValue()), 
                                convertToNative((List<Uint256>) results.get(3).getValue()));
                    }
                });
    }

    public RemoteFunctionCall<Boolean> isKnownParticipant(String _addr, BigInteger _roleID) {
        final Function function = new Function(FUNC_ISKNOWNPARTICIPANT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _addr), 
                new org.web3j.abi.datatypes.generated.Uint256(_roleID)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<String> oracle_addr() {
        final Function function = new Function(FUNC_ORACLE_ADDR, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<String> owner() {
        final Function function = new Function(FUNC_OWNER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<String> paymentProvider_addr() {
        final Function function = new Function(FUNC_PAYMENTPROVIDER_ADDR, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<String> rentableDevices(BigInteger param0) {
        final Function function = new Function(FUNC_RENTABLEDEVICES, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(param0)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<Boolean> requestExists(String _tenant, String _lessor, String _device, BigInteger _term) {
        final Function function = new Function(FUNC_REQUESTEXISTS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _tenant), 
                new org.web3j.abi.datatypes.Address(160, _lessor), 
                new org.web3j.abi.datatypes.Address(160, _device), 
                new org.web3j.abi.datatypes.generated.Uint256(_term)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<Tuple4<String, String, String, BigInteger>> requests(BigInteger param0) {
        final Function function = new Function(FUNC_REQUESTS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(param0)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}, new TypeReference<Address>() {}, new TypeReference<Address>() {}, new TypeReference<Uint256>() {}));
        return new RemoteFunctionCall<Tuple4<String, String, String, BigInteger>>(function,
                new Callable<Tuple4<String, String, String, BigInteger>>() {
                    @Override
                    public Tuple4<String, String, String, BigInteger> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple4<String, String, String, BigInteger>(
                                (String) results.get(0).getValue(), 
                                (String) results.get(1).getValue(), 
                                (String) results.get(2).getValue(), 
                                (BigInteger) results.get(3).getValue());
                    }
                });
    }

    public RemoteFunctionCall<Boolean> verify(String _tenant, String _lessor, String _device, BigInteger _fee, BigInteger _term, byte[] _sig, String _signer) {
        final Function function = new Function(FUNC_VERIFY, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, _tenant), 
                new org.web3j.abi.datatypes.Address(160, _lessor), 
                new org.web3j.abi.datatypes.Address(160, _device), 
                new org.web3j.abi.datatypes.generated.Uint256(_fee), 
                new org.web3j.abi.datatypes.generated.Uint256(_term), 
                new org.web3j.abi.datatypes.DynamicBytes(_sig), 
                new org.web3j.abi.datatypes.Address(160, _signer)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    @Deprecated
    public static RentalProvider load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new RentalProvider(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static RentalProvider load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new RentalProvider(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static RentalProvider load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new RentalProvider(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static RentalProvider load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new RentalProvider(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static class OwnershipTransferredEventResponse extends BaseEventResponse {
        public String previousOwner;

        public String newOwner;
    }
}
