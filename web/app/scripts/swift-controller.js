/**
 * @class MarketController
 * @classdesc
 * @ngInject
 */
 /*

 PaymentOrder : {
  from : '',
  to   : '',
  amount : '',
  purpose: '',
  description:'',

  confirm1 : {boolean},
  confirm2 : {boolean}

 }



 */
function SwiftController($scope, $log, $interval, PeerService, $rootScope) {

  var ctl = this;

  //
  ctl.CONFIRM_OFF = 'off';
  ctl.CONFIRM_LIMIT = 'limit';
  ctl.CONFIRM_ON = 'on';


  ctl.paymentList = [];
  $rootScope.autoconfirm = ctl.CONFIRM_LIMIT;

  ctl.init = function(){
    ctl.reload();
  };

  $rootScope.$on('chainblock', function(payload){
    ctl.reload();
  });

  ctl.reload = function(){
    PeerService.getPayments().then(function(list) {
      ctl.paymentList = list;
      setTimeout(function() { ctl.onListUpdated(); }, 1000);
    });
  };

   ctl.onListUpdated = function(){
        if($rootScope.autoconfirm == ctl.CONFIRM_OFF || ctl.paymentList == null){
            return
        }
        start = $rootScope.autoconfirm == ctl.CONFIRM_ON ? 0 : 2;
        for(var t=start;t<ctl.paymentList.length;t++){
            payment = ctl.paymentList[t];
            if(!payment.confirm1){
                ctl.submitBuyer(payment);
            }
            if(!payment.confirm2){
                ctl.submitSeller(payment);
            }
        }
   };

   ctl.onModeChanged = function(mode){
        $rootScope.autoconfirm = mode;
        ctl.onListUpdated();
   };



  ctl.showInList = function(value, index, array){
    return value.confirm1 !== undefined ||  value.confirm2 !== undefined;
  };

  ctl.getAutoconfirmLabel = function(value){
    switch(value){
      case ctl.CONFIRM_OFF: return 'Off';
      case ctl.CONFIRM_LIMIT: return 'Limit reached';
      case ctl.CONFIRM_ON: return 'On';
      default: return 'Unknown';
    }
  };


  ctl.getAutoconfirmBadge = function(value){
    switch(value){
      case ctl.CONFIRM_OFF: return 'badge-default';
      case ctl.CONFIRM_LIMIT: return 'badge-warning';
      case ctl.CONFIRM_ON: return 'badge-success';
      default: return '';
    }
  };

  ctl.submitBuyer = function(payment){
    payment.confirm2 = undefined
    PeerService.confirmTo(payment.id);
  }
  ctl.submitSeller = function(payment){
    payment.confirm1 = undefined
    PeerService.confirmFrom(payment.id);
  }



}


var responseExample = {
    "Event": "block",
    "register": null,
    "block": {
        "version": 0,
        "timestamp": null,
        "transactions": [
          {
            "type": "CHAINCODE_INVOKE",
            "chaincodeID": {},
            "payload": {},
            "metadata": {},
            "txid": "d6b67c6f-5b77-43aa-8aef-9a528c874016",
            "timestamp": {
              "seconds": "1472243595",
              "nanos": 878832249
            },
            "confidentialityLevel": "PUBLIC",
            "confidentialityProtocolVersion": "",
            "nonce": {},
            "toValidators": {},
            "cert": {},
            "signature": {}
          }
        ],
        "stateHash": {},
        "previousBlockHash": {},
        "consensusMetadata": {},
        "nonHashData": {
            "localLedgerCommitTimestamp": {
              "seconds": "1472243627",
                  "nanos": 376272706
            },
            "chaincodeEvents": [
              {
                "chaincodeID": "",
                "txID": "",
                "eventName": "",
                "payload": {}
              }
            ]
        }
    },
    "chaincodeEvent": null,
    "rejection": null,
    "unregister": null
  };






angular.module('swiftController', ['LocalStorageModule'])
  .controller('SwiftController', SwiftController)
  // .controller('VerifyModalController', VerifyModalController);








