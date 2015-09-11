sc.controller('sc.Details', ['$scope', '$window', '$routeParams', 'appState', function ($scope, $window, $routeParams, appState) {
    $scope.title = "Detail Page";
    window.scrollTo(0, 0);
    var tile = {
        image: $routeParams.id,
        title: 'Lorem epsum salts or something',
        description: 'Some description goes here',
        caption: 'E plurubus unum',
        subTitle: 'All for one',
        href: '/' + $routeParams.id,
        id: $routeParams.id,
        img: $routeParams.id % 3 == 0
            ? 'http://www.prestonspeaks.com/wp-content/uploads/2012/11/Lucian-the-awesome-Husky.jpg'
            : $routeParams.id % 5 == 0
                ? 'https://dogsinmind.files.wordpress.com/2015/08/dove.jpg'
                : 'http://dustytrailshorserescue.org/wp-content/uploads/2011/07/Stella-before.jpg'
    };

    $scope.tile = tile;
    var $head = $('head');
    var fbMeta = '<meta property="og:locale" content="en_US" /><meta property="og:type" content="website" />'
                + '<meta property="og:title" content="' + tile.title +'" />'
                + '<meta property="og:description" content="Page Description" />'
                + '<meta property="og:url" content="http://beta-001.savingchance.com/#' + tile.href + '" />'
                + '<meta property="og:site_name" content="SavingChance.com" />'
                + '<meta property="og:image" content="' + tile.img + '" />';
    $head.find("meta[property^='og:']").remove();
    $head.prepend(fbMeta);
}]);


// need to inject these headers for FB share loading
//<meta property="og:locale" content="en_GB" /><meta property="og:type" content="website" />
//<meta property="og:title" content="Page Title Here" />
//<meta property="og:description" content="Page Description" />
//<meta property="og:url" content="http://www.example.com/" />
//<meta property="og:site_name" content="Example" />
//<meta property="og:image" content="http://www.example.com/image-here.jpg" />