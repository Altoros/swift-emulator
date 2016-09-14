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


    ctl.nodesData = {};
    ctl.paymentList = [];

    ctl.init = function() {
        ctl.reload();
        $rootScope.$on('chainblock', function(payload) {
            ctl.reload();
        });
        var _timer = setInterval(ctl.reload, 5000);
    };

    ctl.reload = function() {
        return PeerService.getGraph().then(function(list) {
            console.log('getGraph', list);
            // // ctl.paymentList = list;
            // setTimeout(function() { ctl.onListUpdated(); }, 1000);
            ctl.nodesData = {};

            ctl.nodesData = {};
            list.Nodes.forEach(function(item) {
                ctl.nodesData[item] = { id: item, loan: {} };
            });

            list.Edges.forEach(function(loan) {
                ctl.nodesData[loan.f].loan = ctl.nodesData[loan.f].loan || {};
                ctl.nodesData[loan.f].loan[loan.t] = {val:loan.v};
            });


        });
    };

    ctl.addCounterParty = function() {
        PeerService.addCounterParty().then(function() {
            return ctl.reload();
        });
    };

    ctl.addClaim = function() {
        var ids = Object.keys(ctl.nodesData);

        var from = ids[parseInt(Math.random() * ids.length)];
        var to, fuse = 100;
        do {
            to = ids[parseInt(Math.random() * ids.length)];
        }while (fuse-- > 0 && !to && to*1 == from*1 /*&& !ctl.nodesData[from].loan[to] */);

        PeerService.addClaim(from, to, 0.1 + Math.random() ).then(function() {
            return ctl.reload();
        });
    };


    ctl.showInList = function(value, index, array) {
        return value.confirm1 !== undefined || value.confirm2 !== undefined;
    };

    ctl.submitBuyer = function(payment) {
        payment.confirm2 = undefined
        PeerService.confirmTo(payment.id);
    }
    ctl.submitSeller = function(payment) {
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
        "transactions": [{
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
        }],
        "stateHash": {},
        "previousBlockHash": {},
        "consensusMetadata": {},
        "nonHashData": {
            "localLedgerCommitTimestamp": {
                "seconds": "1472243627",
                "nanos": 376272706
            },
            "chaincodeEvents": [{
                "chaincodeID": "",
                "txID": "",
                "eventName": "",
                "payload": {}
            }]
        }
    },
    "chaincodeEvent": null,
    "rejection": null,
    "unregister": null
};






angular.module('swiftController', ['LocalStorageModule'])
    .controller('SwiftController', SwiftController)
    // .controller('VerifyModalController', VerifyModalController);
