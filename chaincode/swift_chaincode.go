package main

import (
	"errors"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/op/go-logging"

	"encoding/json"
	"strconv"

	"fmt"
)

var log = logging.MustGetLogger("swift-emulator")

// SimpleChaincode example simple Chaincode implementation
type PaymentChaincode struct {
}


func (t *PaymentChaincode) Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	log.Debugf("function: %s, args: %s", function, args)

	// Create payments table
	err := t.initPayments(stub)
	if err != nil {
		log.Criticalf("function: %s, args: %s", function, args)
		return nil, errors.New("Failed creating payments table.")
	}

	return nil, nil
}

func (t *PaymentChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	log.Debugf("function Invoke: %s, args: %s", function, args)

	// Handle different functions
	if function == "submitPayment" {

		//TODO: uncomment code below when SecurityContext will be propagated in cross chaincode requests
		//access := t.checkCallerRole(stub, []string{"issuer", "investor"})
		//if(!access){
		//	return nil, errors.New("Caller without role 'issuer' or 'investor' cannot execute  'submitPayment' command")
		//}

		if len(args) != 8 {
			return nil, errors.New("Incorrect arguments. Expecting From, To, Amount, purpose, Payment Instruction, chaincodeId, payloadConfirm and payloadDecline.")
		}

		var newPayment payment

		counter, err := t.incrementAndGetCounter(stub, "PaymentCounter")
		if err != nil {
			return nil, err
		}

		newPayment.Id = strconv.FormatUint(counter, 10)

		newPayment.From = args[0]
		newPayment.To = args[1]
		newPayment.Amount = args[2]
		newPayment.Purpose = args[3]
		newPayment.Instructions = args[4]
		newPayment.ChainCodeId = args[5]
		newPayment.PayloadFunction = args[6]
		newPayment.PayloadArgument = args[7]

		newPayment.ConfirmFrom = false
		newPayment.ConfirmTo = false


		if msg, err := t.createPayment(stub, newPayment); err != nil {
			return msg, err
		}
		return nil, nil

	} else if function == "confirmFrom" {

		access := t.checkCallerRole(stub, []string{"swiftagent"})
		if(!access){
			return nil, errors.New("Caller without role 'swiftagent' cannot execute  'confirmFrom' command")
		}

		if len(args) != 1 {
			return nil, errors.New("Incorrect arguments. Expecting paymentId.")
		}

		// Get all contracts issued by issuerId
		payment, err := t.getPayment(stub, args[0])
		if err != nil {
			log.Error("confirmFrom failed on retrieving payment: " + err.Error())
			return nil, err
		}

		payment.ConfirmFrom = true
		
		return nil, t.processPaymentConfirmation(stub, payment)

	} else if function == "confirmTo" {

		access := t.checkCallerRole(stub, []string{"swiftagent"})
		if(!access){
			return nil, errors.New("Caller without role 'swiftagent' cannot execute  'confirmTo' command")
		}

		if len(args) != 1 {
			return nil, errors.New("Incorrect arguments. Expecting paymentId.")
		}

		// Get all contracts issued by issuerId
		payment, err := t.getPayment(stub, args[0])
		if err != nil {
			log.Error("confirmFrom failed on retrieving payment: " + err.Error())
			return nil, err
		}

		payment.ConfirmTo = true

		return nil, t.processPaymentConfirmation(stub, payment)

	} else {
		log.Errorf("function: %s, args: %s", function, args)
		return nil, errors.New("Received unknown function invocation")
	}
}


// Query callback representing the query of a chaincode
func (t *PaymentChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	log.Debugf("function: %s, args: %s", function, args)
	// Handle different functions
	if function == "getPayments" {
		access := t.checkCallerRole(stub, []string{"swiftagent"})
		if(!access){
			return nil, errors.New("Caller without role 'swiftagent' cannot execute  'getPayments' command")
		}

		payments, err := t.getPayments(stub)
		if err != nil {
			return nil, err
		}

		return json.Marshal(payments)

	} else {
		log.Errorf("function: %s, args: %s", function, args)
		return nil, errors.New("Received unknown function invocation")
	}
}

func (t *PaymentChaincode) incrementAndGetCounter(stub shim.ChaincodeStubInterface, counterName string) (result uint64, err error) {
	if contractIDBytes, err := stub.GetState(counterName); err != nil {
		log.Errorf("Failed retrieving %s.", counterName)
		return result, err
	} else {
		result, _ = strconv.ParseUint(string(contractIDBytes), 10, 64)
	}
	result++
	if err = stub.PutState(counterName, []byte(strconv.FormatUint(result, 10))); err != nil {
		log.Errorf("Failed saving %s!", counterName)
		return result, err
	}
	return result, err
}

func (t *PaymentChaincode) processPaymentConfirmation(stub shim.ChaincodeStubInterface, payment_ payment) (error) {
	log.Debugf("processPaymentConfirmation called with:%+v", payment_)

	if(payment_.ConfirmTo == true && payment_.ConfirmFrom == true){
		err := t.sendConfirmationToCorrespondingChaincode(stub, payment_)
		if err != nil {
			log.Error("Failed fetching caller role. Error: " + err.Error())
			return err
		}
		t.archivePayment(stub, payment_.Id)
	}else{
		t.updatePayment(stub, payment_)
	}

	return nil
}

func (t *PaymentChaincode) sendConfirmationToCorrespondingChaincode(stub shim.ChaincodeStubInterface, payment_ payment) (error) {
	log.Debugf("processPaymentConfirmation called with:%+v", payment_)

	var args [][]byte

	args = append(args, []byte(payment_.PayloadFunction))
	args = append(args, []byte(payment_.PayloadArgument))

	response, err := stub.InvokeChaincode(payment_.ChainCodeId, args)
	if err != nil {
		errStr := fmt.Sprintf("Failed to invoke chaincode. Got error: %s", err.Error())
		fmt.Printf(errStr)
		return errors.New(errStr)
	}

	log.Debugf("Invoke chaincode successful. Got response %s", string(response))

	return nil
}

func (t *PaymentChaincode) checkCallerRole(stub shim.ChaincodeStubInterface, roles []string) (bool) {

	callerRole, err := stub.ReadCertAttribute("role")
	if err != nil {
		log.Error("Failed fetching caller role. Error: " + err.Error())
		return false
	}
	stringRole := string(callerRole)
	log.Debugf("Caller role is: %s", callerRole)
	for _, role := range roles {
		if role == stringRole {
			log.Debugf("Caller role is: %s. Caller has right to execute this command.", callerRole)
			return true
		}
	}
	log.Debugf("Caller role is: %s. Caller has NO right to execute this command.", callerRole)
	return false
}



func main() {
	err := shim.Start(new(PaymentChaincode))
	if err != nil {
		log.Critical("Error starting SwiftChaincode: %s", err)
	}
}