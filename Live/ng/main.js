var sc = angular.module('sc', ['infinite-scroll', 'ngRoute', 'ngAnimate']);
var $masonry = null;

sc.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
      });
  }]);

sc.factory('appState', function ($window) {
    this['browse'] = { windowState: {}, pageState: {} };
    this['detail'] = { windowState: {}, pageState: {} };
    return this;
});

sc.directive('scSearch', function () {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            element.bind('click', function (e) {
                $scope.search(attrs);
            })
        }
    }
});

