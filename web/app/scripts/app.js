angular.module('app', ['ui.router',
                       'ui.bootstrap',
                       'peerService',
                       'mainController',
                       'config',
                       'MyBlockchain'])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/main');

  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'partials/main.html',
      controller: 'MainController as ctl'
    });
});
