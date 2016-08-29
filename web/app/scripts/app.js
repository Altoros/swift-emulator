angular.module('app', ['ui.router',
                       'ui.bootstrap',
                       'peerService',
                       'swiftController',
                       'config'])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/swift');

  $stateProvider
    .state('swift', {
      url: '/swift',
      templateUrl: 'partials/swift.html',
      controller: 'SwiftController as ctl'
    });

  /*
  .state('demo', {
    url: '/',
    templateUrl: 'partials/demo.html',
    controller: 'DemoController as ctl'
  })
  .state('demo.issuerContractList', {
    url: 'issuer-contracts',
    templateUrl: 'partials/issuer-contract-list.html',
    controller: 'IssuerContractListController as ctl'
  })
  .state('demo.investorContractList', {
    url: 'investor-contracts',
    templateUrl: 'partials/investor-contract-list.html',
    controller: 'InvestorContractListController as ctl'
  })
  .state('demo.bondList', {
    url: 'bonds',
    templateUrl: 'partials/bond-list.html',
    controller: 'BondListController as ctl'
  })
  .state('demo.market', {
    url: 'market',
    templateUrl: 'partials/market.html',
    controller: 'MarketController as ctl'
  })*/


})
/*.controller('SiteController', function(){


});*/


/*

<div id="footerWrap" hidden="" style="display: block;">
  <div id="blockWrap">
    <div id="details" style="left: 0px; display: none;">
      <p class="blckLegend"> Block Height: 15</p>
      <hr class="line">
      <p>Created: &nbsp;08-26-2016 11:21am UTC</p>
      <p> UUID: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5967b486-5a69-4ff8-8227-baaa5346c559</p>
      <p> Type:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2</p>
      <p> CC ID:  &nbsp;&nbsp;&nbsp;&nbsp;d827db009bcbfd840b2197345d878a6fad03f375e7d6191f7ed12e169f23ee3c9baaa02d06d3c6bf30b29a621c0345bbad90cb048fbcacc0949bcf29168065de</p>
      <p> Payload:  &nbsp;set_user: demo_marbleleroy</p>
    </div>

    <div class="block" style="opacity: 1; left: 0px;">015</div>
    <div class="block" style="opacity: 1; left: 36px;">016</div>
    <div class="block" style="opacity: 1; left: 72px;">017</div>
    <div class="block" style="opacity: 1; left: 108px;">018</div>
    <div class="block" style="opacity: 1; left: 144px;">019</div>
    <div class="block" style="opacity: 1; left: 180px;">020</div>
    <div class="block" style="opacity: 1; left: 216px;">021</div>
    <div class="block lastblock" style="opacity: 1; left: 252px;">022</div>
  </div>
</div>

*/