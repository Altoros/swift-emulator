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
function SwiftController($scope, $log, $interval, /*$uibModal, localStorageService,*/ PeerService) {

  var ctl = this;

  //
  ctl.CONFIRM_OFF = 'off';
  ctl.CONFIRM_LIMIT = 'limit';
  ctl.CONFIRM_ON = 'on';


  ctl.paymentList = [];
  ctl.autoconfirm = ctl.CONFIRM_LIMIT;

  ctl.init = function(){
    ctl.reload();
  };

  ctl.reload = function(){
    PeerService.getPayments().then(function(list) {
      ctl.paymentList = list;
    });
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

}

/*

  PeerService.confirm1()
  PeerService.confirm2()


/*

  ctl.requests = [];
  ctl.requestsVerified = [];


  var init = function() {
      _refreshData();
  };

  $scope.$on('$viewContentLoaded', init);

  $interval(init, 5000);

  ctl.user = UserService.getUser();

  ctl.open = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'verify-contract-modal.html',
      controller: 'VerifyModalController as ctl'
    });

    modalInstance.result.then(function(result) {
      console.log('Window closed:', result);

      console.log(ctl.requests);
      ctl.requests.push(result);

      _updateData();
    });
  };

  ctl.verify = function(paymentRequest){
    var index = ctl.requests.indexOf(paymentRequest);

    PeerService.verify(paymentRequest.description, paymentRequest.amount)
      .then(function(status){
        paymentRequest.status = status;

        if(paymentRequest.status.state==='OK'){
          ctl.requestsVerified = ctl.requestsVerified.concat( ctl.requests.splice(index, 1) );
        }else{
          paymentRequest.description = paymentRequest.status.message;
        }

//        $scope.$digest();
        _updateData();
      });

  };


  ctl.decline = function(paymentRequest){
    ctl.requests.splice(ctl.requests.indexOf(paymentRequest), 1);
    _updateData();
  };



  ctl.submitOnline = function(index){
    var requestVerified = ctl.requestsVerified.splice(index, 1)[0];
    // TODO:
    if(requestVerified.purpose == "coupons"){
        PeerService.payCoupons(requestVerified.from, requestVerified.description);
    }else{
        PeerService.confirm(requestVerified.description);
    }
    _updateData();

  };


  function _updateData(){
    localStorageService.set('pr', ctl.requests);
    localStorageService.set('prv', ctl.requestsVerified);
  }

  function _refreshData(){
    // requests
    ctl.requests = localStorageService.get('pr') || [];
    ctl.requestsVerified = localStorageService.get('prv') || [];
  }

}



function VerifyModalController($uibModalInstance) {

  var ctl = this;

  ctl.ok = function (paymentRequest) {
    $uibModalInstance.close(paymentRequest);
  };

  ctl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}
*/


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





/* global $, document, formatDate, nDig, atob */
/* exported clear_blocks, new_block */

/*
var block = 0;
var blocks = [];

$(document).on('ready', function() {
  setInterval(function(){
    move_on_down();
  }, 2000);

  var clicked = false;
  $(document).on('click', '.block', function(event){
    clicked = !clicked;
    show_details(event, Number($(this).html()));
  });

  $(document).on('mouseover', '.block', function(event){
    show_details(event, Number($(this).html()));
  });

  $(document).on('mouseleave', '#blockWrap', function(){
    if(!clicked) $('#details').fadeOut();
  });
});


function show_details(event, id){               //build the block details html
  var left = event.pageX - $('#details').parent().offset().left - 50;
  if(left < 0) left = 0;
  var ccid = formatCCID(blocks[id].blockstats.transactions[0].type, blocks[id].blockstats.transactions[0].uuid, atob(blocks[id].blockstats.transactions[0].chaincodeID));
  var payload = atob(blocks[id].blockstats.transactions[0].payload);

  var html = '<p class="blckLegend"> Block Height: ' + blocks[id].id + '</p>';
  html += '<hr class="line"/><p>Created: &nbsp;' + formatDate(blocks[id].blockstats.transactions[0].timestamp.seconds * 1000, '%M-%d-%Y %I:%m%p') + ' UTC</p>';
  html += '<p> UUID: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + formatUUID(blocks[id].blockstats.transactions[0].type, blocks[id].blockstats.transactions[0].uuid) + '</p>';
  html += '<p> Type:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + formatType(blocks[id].blockstats.transactions[0].type) + '</p>';
  html += '<p> CC ID:  &nbsp;&nbsp;&nbsp;&nbsp;' + ccid + '</p>';
  html += '<p> Payload:  &nbsp;' + formatPayload(payload, ccid) + '</p>';
  $('#details').html(html).css('left', left).fadeIn();
}

function new_block(newblck){                  //rec a new block
  if(!blocks[Number(newblck.id)]){
    for(var last in blocks);                //find the id of the last known block
    if(!last) last = 0;
    last++;
    //console.log('last', last, Number(newblck.id));
    if(block > 0){                      //never fake blocks on an initial load
      for(var i=last; i < Number(newblck.id); i++){   //build fake blocks for ones we missed out on
        console.log('run?');
        blocks[Number(i)] = newblck;
        build_block(i);
      }
    }
    blocks[Number(newblck.id)] = newblck;
    build_block(newblck.id);                //build block
  }
}

function build_block(id){                   //build and append the block html
  $('#blockWrap').append('<div class="block">' +  nDig(id, 3) + '</div>');
  $('.block:last').animate({opacity: 1, left: (block * 36)}, 600, function(){
    $('.lastblock').removeClass('lastblock');
    $('.block:last').addClass('lastblock');
  });
  block++;
}

function move_on_down(){                    //move the blocks left
  if(block > 10){
    $('.block:first').animate({opacity: 0}, 800, function(){$('.block:first').remove();});
    $('.block').animate({left: '-=36'}, 800, function(){});
    block--;
  }
}

function clear_blocks(){                    //empty blocks
  block = 0;
  blocks = [];
  $('.block').remove();
}


function formatCCID(i, uuid, ccid){               //flip uuid and ccid if deploy, weird i know
  if(i == 1) return uuid;
  return ccid;
}

function formatUUID(i, uuid){                 //blank uuid if deploy, its just ccid again
  if(i == 1) return '-';
  return uuid;
}

function formatType(i){                     //spell out deploy or invoke
  if(i == 1) return 'deploy';
  if(i == 3) return 'invoke';
  return i;
}

function formatPayload(str, ccid){                //create a sllliiiggghhhtttlllllyyy better payload name from decoded payload
  var func = ['init', 'delete', 'write', 'init_marble', 'set_user', 'open_trade', 'perform_trade', 'remove_trade'];
  str =  str.substring(str.indexOf(ccid) + ccid.length + 4);
  for(var i in func){
    if(str.indexOf(func[i]) >= 0){
      return func[i] + ': ' + str.substr(func[i].length);
    }
  }
  return str;
}

*/


