var sc = angular.module('sc', ['infinite-scroll', 'ngRoute', 'ngAnimate']);
var $masonry = null;

sc.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
      $routeProvider.
        //when('/Chance/:id', {
        //    templateUrl: '/ng/areas/details/details.html',
        //    controller: 'sc.Details'
        //}).
        when('/', {
            templateUrl: '/ng/areas/main/browse.html',
            controller: 'sc.Browse',
            reloadOnsearch: true
        });
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

