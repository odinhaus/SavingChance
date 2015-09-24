var sc = angular.module('sc', ['infinite-scroll', 'ngRoute', 'ngAnimate']);
var $masonry = null;

sc.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/Campaign/:id', {
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

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});

function fbShare()
{
    FB.ui({
        app_id: 1516907565266690,
        method: 'feed',
        link: 'http://beta-001.savingchance.com/',
        caption: 'Saving Chance',
        picture: 'http://beta-001.savingchance.com/images/Logo-Hex-400.png',
        description: 'We believe every animal should have a Chance at a good life. Our mission is to connect people who are willing to help animals in need get the resources they deserve.'
    }, function (response) { });
}