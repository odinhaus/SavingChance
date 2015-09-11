var sc = angular.module('sc', ['infinite-scroll', 'ngRoute', 'ngAnimate']);
var $masonry = null;

sc.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/Campaign/:id', {
            templateUrl: '/ng/areas/details/details.html',
            controller: 'sc.Details'
        }).
        when('/Login', {
            templateUrl: '/ng/areas/login/login.html',
            controller: 'sc.Login'
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

function getLocation(address, callback)
{
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            callback( { latitude: latitude, longitude: longitude } );
        }
    });
}

$('#navButton').click(function () {
    $('#nav').toggleClass('open');
    $('#navTool').toggleClass('active');
});