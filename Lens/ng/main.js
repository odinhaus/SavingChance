var sc = angular.module('sc', ['infinite-scroll', 'ngRoute']);
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

//sc.factory('windowState', function($window)
//{
//    this.bodyWidth = $window.innerWidth;
//    this.columnCount = 5;
//    this.gutterWidth = 0;
//    return this;
//})