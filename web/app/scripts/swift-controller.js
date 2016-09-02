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
  ctl.autoconfirm = ctl.CONFIRM_LIMIT;

  ctl.init = function(){
    ctl.reload();
    $rootScope.$on('chainblock', function(payload){
          ctl.reload();
    });
  };

  ctl.reload = function(){
    PeerService.getPayments().then(function(list) {
      ctl.paymentList = list;
    });
  };

//  if($rootScope._timer){
//    $interval.cancel($rootScope._timer);
//  }
//  $rootScope._timer = $interval(ctl.reload, 2000);



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






// scope:
// = is for two-way binding
// @ simply reads the value (one-way binding)
// & is used to bind functions
.directive('blockchainLog', function($document){
  return {
    restrict:'E',
    replace: false,
    scope: true,
    // scope: { name:'=', id:'=' },
    template: '<div class="bc-wrapper" id="footerWrap" ng-init="ctl.init()" d-ng-click="ctl.onClick($event)">'
                +'<div id="bc-wrapper-block">'

                  +'<div id="details" ng-show="!!ctl.blockInfo" >'
                    +'<p class="blckLegend"> Block: {{ctl.blockInfo.txid}}</p>'
                    +'<hr class="line">'
                    +'<p>Created: {{ctl.blockInfo.timestamp.seconds}}</p>'
                    +'<p> TXID: {{ctl.blockInfo.txid}}</p>'
                    +'<p> Type:  {{ctl.blockInfo.type}}</p>'
                    +'<p> Confidentiality Level:  {{ctl.blockInfo.confidentialityLevel}}</p>'
                  +'</div>'


                  // +'<div class="block" style="opacity: 1; left: 36px;">016</div>'
                  // +'<div class="block" style="opacity: 1; left: 72px;">017</div>'
                  // +'<div class="block" style="opacity: 1; left: 108px;">018</div>'
                  // +'<div class="block" style="opacity: 1; left: 144px;">019</div>'
                  // +'<div class="block" style="opacity: 1; left: 180px;">020</div>'
                  // +'<div class="block" style="opacity: 1; left: 216px;">021</div>'
                  // +'<div class="block lastblock" style="opacity: 1; left: 252px;">022</div>'
                +'</div>'
              +'</div>',
    controllerAs: 'ctl',
    controller: function($scope, $element, $attrs, $transclude, $rootScope){
      var ctl = this;

      var clicked=false;
      var blockCount = 0;
      var blockWidth = 36;

      ctl.blockInfo = null;

      setInterval(function(){
        removeExtraBlocks();
      }, 2000);

      /**
       *
       */
      ctl.init = function(){
        var socket = io('ws://'+location.hostname+':8155/');
        socket.emit('hello', 'Hi from client');

        socket.on('hello', function(payload){
          console.log('server hello:', payload);
        });

        socket.on('chainblock', function(payload){
          console.log('server chainblock:', payload);
          $rootScope.$emit('chainblock', payload);
          addChainblocks(payload);
        });
      };


      // demo
      ctl.onClick = function(e){

        // demo chaincode!
        addChainblocks(responseExample);
      };





      /**
       * @param chainblock
       */
      function addChainblocks(chainblock){
        var width = $(document).width();
        var tx = chainblock && chainblock.block && chainblock.block.transactions || [];

        $element.find('#bc-wrapper-block').append( tx.map(function(item){
          var $el = _blockHtml(item).css({left: '+='+width }).animate({ left: '-='+width } );
          blockCount++;
          return $el;
        }));
      }

      function _blockHtml(tx){
        return $('<div class="block">'+tx.txid.substr(0,3)+'</div>')
                  .css({left: (blockCount * blockWidth)})
                  .click(_onBlockClick)
                  .hover(getBlockHoverIn(tx), onBlockHoverOut);
      }



      function _onBlockClick(e){
        clicked = !clicked;
        return;

        //demo animation
        var $block = $(e.target);
        var width = $(document).width();
        $block.css({left: '+='+width }).animate({ left: '-='+width } );
        e.stopPropagation();
      }

      function getBlockHoverIn(tx){
          // blockInfo
          return function(e){
            // if(!ctl.blockInfo || ctl.blockInfo.txid != tx.txid){
              ctl.blockInfo = tx;
              $scope.$digest();
              // $details.css({left : $(e.target).position().left }).stop(true).fadeIn();
            // }
          }
      }

      function onBlockHoverOut(e){
          if(!clicked){
            ctl.blockInfo = null;
            $scope.$digest();
            // $details.stop(true).fadeOut();
          }
      }

      /**
       * Remove extra blocks
       */
      function removeExtraBlocks(){
        if(blockCount > 10){
          var toRemove = blockCount - 10;
          $element.find('.block:lt('+toRemove+')').animate({opacity: 0}, 800, function(){$('.block:first').remove(); /* blocks.slice(toRemove); */ });
          $element.find('.block').animate({left: '-='+blockWidth*toRemove}, 800, function(){});
          blockCount -= toRemove;
        }
      }

    }//-controller
}});




