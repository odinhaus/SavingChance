function getLocation(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            callback({ latitude: latitude, longitude: longitude });
        }
    });
}

function fbShare() {
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

function doSearch() {
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

function setTab(element) {
    var $this = $(element);
    $('.tabButton').each(function (index, elem) {
        $(this).removeClass('selected');
        $($(this).attr("name")).css('display', 'none');
    });
    $this.addClass('selected');
    $($this.attr('name')).css('display', 'block');
}

function applyEditables() {
    $(document).ready(function () {
        $('[sc-data]').each(function (i, elm) {
            var $elm = $(elm);
            
        });
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
