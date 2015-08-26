var sc = angular.module('sc', ['infinite-scroll', 'ngRoute', 'ngAnimate']);
var $masonry = null;

sc.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/:id', {
            templateUrl: '/ng/areas/details/details.html',
            controller: 'sc.Details'
        }).
        otherwise({
            templateUrl: '/ng/areas/main/browse.html',
            controller: 'sc.Browse'
        });
  }]);

sc.factory('appState', function ($window) {
    this['browse'] = { windowState: {}, pageState: {} };
    this['detail'] = { windowState: {}, pageState: {} };
    return this;
});