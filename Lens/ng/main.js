var myApp = angular.module('myApp', ['infinite-scroll']);

myApp.controller('DemoController', function ($scope, $window) {
    $scope.tiles = [];
    $scope.tileWidth = 229;
    $scope.gutterWidth = 30;
    
    $scope.loadMore = function () {
        var rowCount = Math.floor($window.innerWidth / $scope.tileWidth);
        $scope.bodyWidth = rowCount * $scope.tileWidth;
        var last = $scope.tiles.length;
        for (var i = 1; i <= rowCount * 3; i++) {
            var tile = {
                image: last + i,
                title: 'Lorem epsum salts or something',
                caption: 'E plurubus unum',
                subTitle: 'All for one'
            };
            $scope.tiles.push(tile);
        }
    };
});

myApp.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };

        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function () {
                return {
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            var rowCount = Math.floor(($window.innerWidth - 2 * scope.gutterWidth) / scope.tileWidth);
            scope.bodyWidth = rowCount * scope.tileWidth;
            scope.$apply();
        });
    }
});