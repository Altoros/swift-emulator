/**
 * @class PeerService
 * @classdesc
 * @ngInject
 */
function PeerService($log, $q, $http, cfg) {

  // jshint shadow: true
  var PeerService = this;


  // netting
  PeerService.getStats = function(){
    return query('Stats', []);
  };
  PeerService.getClaims = function(uid){
    return query('Claims', [''+uid]);
  };

  PeerService.addCounterParty = function(){
    return invoke('AddCounterParty', []);
  };
  PeerService.addClaim = function(uidFrom, uidTo, value){
    return invoke('AddClaim', [''+uidFrom, ''+uidTo, ''+value] );
  };
  PeerService.runNetting = function(){
    return invoke('RunNetting', []);
  };


  // swift
  PeerService.getPayments = function(){
    return query('getPayments', []);
  };




  PeerService.confirmFrom = function(paymentId){
    return invoke('confirmFrom', [''+paymentId]);
  };
  PeerService.confirmTo = function(paymentId){
    return invoke('confirmTo', [''+paymentId]);
  };


  var payload = {
      'jsonrpc': '2.0',
      'params': {
        'type': 1,
        'chaincodeID': {
          name: cfg.chaincodeID
        },
        'ctorMsg': {},
        "attributes": ["role"]
      },
      'id': 0
  };



  var invoke = function(functionName, functionArgs) {
    $log.debug('PeerService.invoke');

    payload.method = 'invoke';
//    payload.params.ctorMsg['function'] = functionName;
    payload.params.ctorMsg.args = encodeToBase64(functionName, functionArgs);
    payload.params.secureContext = cfg.secureContext;

    $log.debug('payload', payload);

    return $http.post(cfg.endpoint, angular.copy(payload)).then(function(data) {
      $log.debug('result', data.data.result);
    });
  };

  var query = function(functionName, functionArgs) {
    $log.debug('PeerService.query');

    var d = $q.defer();

    payload.method = 'query';
//    payload.params.ctorMsg['function'] = functionName;
    payload.params.ctorMsg.args = encodeToBase64(functionName, functionArgs);
    payload.params.secureContext = cfg.secureContext;


    $log.debug('payload', payload);

    $http.post(cfg.endpoint, angular.copy(payload)).then(function(res) {
      // $log.debug('result', res.data.result);
      if(res.data.error) {
        logReject(d, res.data.error);
      }
      else if(res.data.result.status === 'OK') {
        d.resolve(JSON.parse(res.data.result.message));
      }
      else {
        logReject(d, res.data.result);
      }
    });

    return d.promise;
  };

  var logReject = function(d, o) {
    $log.error(o);
    d.reject(o);
  };

}

var encodeToBase64 = function(functionName, functionArgs) {
//    for (var i = 0; i < functionArgs.length; i++) {
//        functionArgs[i] = btoa(functionArgs[i]);
//    }
    functionArgs.splice(0, 0, functionName);
    return functionArgs
};

var getMaturityDate = function(term) {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + term, now.getDate());
};

var getMaturityDateString = function(term) {
  var m = getMaturityDate(term);
  return m.getFullYear() + '.' + (m.getMonth() + 1) + '.' + m.getDate();
};


angular.module('peerService', []).service('PeerService', PeerService);