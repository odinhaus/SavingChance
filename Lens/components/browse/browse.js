(function() {
// route controllers need to be PascalCased names matching folder/file names in components folder
    var browseModule = angular.module("app.browse", []).controller("BrowseController", ['pageState', BrowseController]);
// route controllers cannot accept $scope injections - just scab observables directly onto this
function BrowseController($state) {
    this.Items = ['Item 1', 'Item 2', 'Item 3'];
    $state.page = 'browse';
}
}());