(function() {
// route controllers need to be PascalCased names matching folder/file names in components folder
var titleModule = angular.module("app.title", []).controller("TitleController", ['pageState', TitleController]);
// route controllers cannot accept $scope injections - just scab observables directly onto this
function TitleController($state) {
    this.Title = "Some Text";
    $state.page = 'title';
}
}());