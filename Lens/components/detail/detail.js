(function() {
// route controllers need to be PascalCased names matching folder/file names in components folder
    var detailModule = angular.module("app.detail", []).controller("DetailController", ['pageState', DetailController]);
// route controllers cannot accept $scope injections - just scab observables directly onto this
function DetailController($state) {
    this.Name = 'My Details';
    $state.page = 'detail';
}
}());