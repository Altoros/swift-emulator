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

angular.module('swiftController', ['LocalStorageModule'])
  .controller('SwiftController', SwiftController)
  // .controller('VerifyModalController', VerifyModalController);

