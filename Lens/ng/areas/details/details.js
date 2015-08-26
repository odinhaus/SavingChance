sc.controller('sc.Details', ['$scope', '$window', '$routeParams', 'appState', function ($scope, $window, $routeParams, appState) {
    $scope.title = "Detail Page";
    window.scrollTo(0, 0);
    var tile = {
        image: $routeParams.id,
        title: 'Lorem epsum salts or something',
        caption: 'E plurubus unum',
        subTitle: 'All for one',
        id: $routeParams.id,
        img: $routeParams.id % 3 == 0
            ? 'http://www.prestonspeaks.com/wp-content/uploads/2012/11/Lucian-the-awesome-Husky.jpg'
            : $routeParams.id % 5 == 0
                ? 'https://dogsinmind.files.wordpress.com/2015/08/dove.jpg'
                : 'http://dustytrailshorserescue.org/wp-content/uploads/2011/07/Stella-before.jpg'
    };

    $scope.tile = tile;
}]);