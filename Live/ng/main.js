var sc = angular.module('sc', ['infinite-scroll', 'ngRoute', 'ngAnimate']);
var $masonry = null;

sc.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
      $routeProvider.
        when('/Chance/:id', {
            templateUrl: '/ng/areas/details/details.html',
            controller: 'sc.Details'
        }).
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

/**
 * Number.prototype.format(n, x)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of sections
 */
Number.prototype.toCurrency = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

function doSearch()
{
    //var $main = $('#main');
    //var applied = false;
    var query = $('#search-form').serializeArray();
    var queryPath = query[0].value ? "/?" + query[0].name + "=" + encodeURIComponent(query[0].value) : "/";
    //if ($main)
    //{
    //    // we're in an angular spa view that supports searching
    //    var $scope = angular.element($main).scope();
    //    if ($scope) {
    //        $scope.search(query);
    //        //history.pushState(query, "Home Page", queryPath);
    //        applied = true;
    //    }
    //}
    //if (!applied)
    //{
        window.location.assign(queryPath);
    //}
    event.preventDefault();
    return false;
}