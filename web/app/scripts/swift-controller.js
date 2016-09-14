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
    $scope.Math = window.Math;


    ctl.nodesData = {};
    ctl.stats = {};

    ctl.init = function() {
        ctl.reload();
        $rootScope.$on('chainblock', function(payload) {
            ctl.reload();
        });
        // var _timer = setInterval(ctl.reload, 5000);
    };

    ctl.reload = function() {

        PeerService.getStats().then(function(list){
            console.log('getStats', list);
            ctl.stats = list;
        });


        return PeerService.getGraph().then(function(list) {
            console.log('getGraph', list);

            // setTimeout(function() { ctl.onListUpdated(); }, 1000);
            ctl.nodesData = {};

            ctl.nodesData = {};
            list.Nodes.forEach(function(item) {
                ctl.nodesData[item] = { id: item, loan: {} };
            });

            list.Edges.forEach(function(loan) {
                ctl.nodesData[loan.f].loan = ctl.nodesData[loan.f].loan || {};
                ctl.nodesData[loan.f].loan[loan.t] = { val: loan.v };
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

        var from, to, fuse = 100;
        do {
            from = ids[parseInt(Math.random() * ids.length)];
            to = ids[parseInt(Math.random() * ids.length)];
            var val = 0.1 + Math.random();

            var val_back = ctl.nodesData[to].loan[from] ? ctl.nodesData[to].loan[from].val : 0;

        } while (fuse-- > 0 && ( (to == from) || !!ctl.nodesData[from].loan[to] || val < val_back) );
        if (fuse <= 0) {
            console.warn('addClaim: fuse reached zero');
        }

        PeerService.addClaim(from, to, val).then(function() {
            return ctl.reload();
        });
    };


    ctl.runNetting = function() {
        PeerService.runNetting().then().then(function() {
            return ctl.reload();
        });
    };

    ctl.clearNetting = function(){
        PeerService.clearNetting();
    };


    var demo_counterparty_count = 10;
    var demo_loans_i = 0;
    var demo_loans = [
        ["0", "5", "55.0"],
        ["0", "6", "20.0"],
        ["0", "2", "115.0"],
        ["0", "3", "30.0"],
        ["0", "4", "65.0"],
        ["1", "3", "70.0"],
        ["1", "4", "85.0"],
        ["1", "5", "65.0"],
        ["1", "8", "40.0"],
        ["1", "0", "70.0"],
        ["2", "7", "80.0"],
        ["2", "9", "100.0"],
        ["2", "1", "60.0"],
        ["2", "8", "20.0"],
        ["2", "3", "50.0"],
        ["2", "4", "110.0"],
        ["2", "6", "35.0"],
        ["3", "5", "5.0"],
        ["3", "6", "30.0"],
        ["3", "9", "130.0"],
        ["4", "3", "155.0"],
        ["4", "6", "30.0"],
        ["4", "8", "30.0"],
        ["5", "4", "45.0"],
        ["5", "9", "30.0"],
        ["5", "2", "80.0"],
        ["5", "8", "70.0"],
        ["6", "1", "55.0"],
        ["6", "5", "15.0"],
        ["7", "0", "5.0"],
        ["7", "3", "95.0"],
        ["7", "4", "65.0"],
        ["7", "5", "20.0"],
        ["7", "6", "25.0"],
        ["7", "9", "40.0"],
        ["8", "6", "35.0"],
        ["8", "7", "45.0"],
        ["8", "0", "15.0"],
        ["8", "3", "50.0"],
        ["8", "9", "65.0"],
        ["9", "1", "10.0"],
        ["9", "4", "30.0"],
        ["9", "6", "115.0"],
        ["9", "0", "45.0"]
    ];

    ctl.initDemo = function() {

        _addcp().then(_addloans);
    };

    function _addcp(n){
        if(--demo_counterparty_count<=0){
            return Promise.resolve();
        }else{
            return PeerService.addCounterParty().then(_addcp);
        }
    }


    function _addloans(){
        if(demo_loans_i >= demo_loans.length-1){
            return Promise.resolve();
        }else{
            var claim = demo_loans[demo_loans_i++];
            return PeerService.addClaim(claim[0], claim[1], claim[2]).then(_addloans);
        }

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
