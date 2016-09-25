package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"errors"
	"fmt"
	"strconv"
)


type payment struct {
	Id             string `json:"id"`
	From           string `json:"from"`
	To             string `json:"to"`
	Amount         string `json:"amount"`
	Purpose        string `json:"purpose"`
	Instructions   string `json:"description"`
	ChainCodeId    string `json:"chaincode"`
	PayloadFunction string `json:"payloadFunction"`
	PayloadArgument string `json:"payloadArgument"`
	ConfirmFrom    bool `json:"confirm1"`
	ConfirmTo      bool `json:"confirm2"`
}

func (payment_ *payment) readFromRow(row shim.Row) {
	payment_.Id 	         = row.Columns[0].GetString_()
	payment_.From            = row.Columns[1].GetString_()
	payment_.To 	         = row.Columns[2].GetString_()
	payment_.Amount 	 = row.Columns[3].GetString_()
	payment_.Purpose 	 = row.Columns[4].GetString_()
	payment_.Instructions 	 = row.Columns[5].GetString_()
	payment_.ChainCodeId 	 = row.Columns[6].GetString_()
	payment_.PayloadFunction = row.Columns[7].GetString_()
	payment_.PayloadArgument = row.Columns[8].GetString_()
	payment_.ConfirmFrom 	 = row.Columns[9].GetBool()
	payment_.ConfirmTo 	 = row.Columns[10].GetBool()
}



func (t *PaymentChaincode) initPayments(stub shim.ChaincodeStubInterface) (error) {
	// Create payment table
	err := stub.CreateTable("payment", []*shim.ColumnDefinition{
		&shim.ColumnDefinition{Name: "Id", Type: shim.ColumnDefinition_STRING, Key: true},
		&shim.ColumnDefinition{Name: "From", Type: shim.ColumnDefinition_STRING, Key: false},
		&shim.ColumnDefinition{Name: "To", Type: shim.ColumnDefinition_STRING, Key: false},
		&shim.ColumnDefinition{Name: "Amount", Type: shim.ColumnDefinition_STRING, Key: false},
		&shim.ColumnDefinition{Name: "Purpose", Type: shim.ColumnDefinition_STRING, Key: false},
		&shim.ColumnDefinition{Name: "Instructions", Type: shim.ColumnDefinition_STRING, Key: false},
		&shim.ColumnDefinition{Name: "ChainCodeId", Type: shim.ColumnDefinition_STRING, Key: false},
		&shim.ColumnDefinition{Name: "PayloadFunction", Type: shim.ColumnDefinition_STRING, Key: false},
		&shim.ColumnDefinition{Name: "PayloadArgument", Type: shim.ColumnDefinition_STRING, Key: false},
		&shim.ColumnDefinition{Name: "ConfirmFrom", Type: shim.ColumnDefinition_BOOL, Key: false},
		&shim.ColumnDefinition{Name: "ConfirmTo", Type: shim.ColumnDefinition_BOOL, Key: false},
	})
	if err != nil {
		log.Criticalf("Cannot initialize Payments")
		return errors.New("Failed creating Payment table.")
	}

	err = stub.PutState("PaymentCounter", []byte(strconv.FormatUint(0, 10)))
	if err != nil {
		return err
	}


	return nil
}

func (t *PaymentChaincode) getPayments(stub shim.ChaincodeStubInterface) ([]payment, error) {
	var columns []shim.Column

	rows, err := stub.GetRows("payment", columns)
	if err != nil {
		message := "Failed retrieving payments. Error: " + err.Error()
		log.Error(message)
		return nil, errors.New(message)
	}

	var payments []payment

	for row := range rows {
		result := payment{
			Id:       	       row.Columns[0].GetString_(),
			From:                  row.Columns[1].GetString_(),
			To:                    row.Columns[2].GetString_(),
			Amount:                row.Columns[3].GetString_(),
			Purpose:               row.Columns[4].GetString_(),
			Instructions:          row.Columns[5].GetString_(),
			ChainCodeId:           row.Columns[6].GetString_(),
			PayloadFunction:       row.Columns[7].GetString_(),
			PayloadArgument:       row.Columns[8].GetString_(),
			ConfirmFrom:           row.Columns[9].GetBool(),
			ConfirmTo:             row.Columns[10].GetBool()}

		log.Debugf("getPayments result includes: %+v", result)
		payments = append(payments, result)
	}

	return payments, nil
}

func (t *PaymentChaincode) createPayment(stub shim.ChaincodeStubInterface, payment_ payment) ([]byte, error) {

	if ok, err := stub.InsertRow("payment", shim.Row{
		Columns: []*shim.Column{
			&shim.Column{Value: &shim.Column_String_{String_: payment_.Id}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.From}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.To}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.Amount}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.Purpose}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.Instructions}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.ChainCodeId}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.PayloadFunction}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.PayloadArgument}},
			&shim.Column{Value: &shim.Column_Bool{Bool: payment_.ConfirmFrom}},
			&shim.Column{Value: &shim.Column_Bool{Bool: payment_.ConfirmTo}}},
	}); !ok {
		log.Error("Failed inserting new payment: " + err.Error())
		return nil, err
	}

	return nil, nil
}

func (t *PaymentChaincode) updatePayment(stub shim.ChaincodeStubInterface, payment_ payment) ([]byte, error) {

	if ok, err := stub.ReplaceRow("payment", shim.Row{
		Columns: []*shim.Column{
			&shim.Column{Value: &shim.Column_String_{String_: payment_.Id}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.From}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.To}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.Amount}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.Purpose}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.Instructions}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.ChainCodeId}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.PayloadFunction}},
			&shim.Column{Value: &shim.Column_String_{String_: payment_.PayloadArgument}},
			&shim.Column{Value: &shim.Column_Bool{Bool: payment_.ConfirmFrom}},
			&shim.Column{Value: &shim.Column_Bool{Bool: payment_.ConfirmTo}}},
	}); !ok {
		log.Error("Failed replacing payment: " + err.Error())
		return nil, err
	}
	return nil, nil
}

func (t *PaymentChaincode) archivePayment(stub shim.ChaincodeStubInterface, paymentId string) ([]byte, error) {

	var columns []shim.Column
	col1 := shim.Column{Value: &shim.Column_String_{String_: paymentId}}
	columns = append(columns, col1)

	err := stub.DeleteRow("payment", columns)
	if err != nil {
		return nil, fmt.Errorf("archivePayment operation failed. %s", err)
	}

	return nil, nil
}



func (t *PaymentChaincode) getPayment(stub shim.ChaincodeStubInterface, paymentId string) (payment, error) {
	var columns []shim.Column
	col1 := shim.Column{Value: &shim.Column_String_{String_: paymentId}}
	columns = append(columns, col1)

	row, err := stub.GetRow("payment", columns)
	if err != nil {
		message := "Failed retrieving payment ID " + paymentId + ". Error: " + err.Error()
		log.Error(message)
		return payment{}, errors.New(message)
	}

	var result payment
	if len(row.Columns) == 0 || row.Columns[0].GetString_() != paymentId {
		log.Debugf("getPayment result: nil")
		return result, errors.New("getPayment result: nil")
	}
	result.readFromRow(row)
	log.Debugf("getPayment result: %+v", result)
	return result, nil
}