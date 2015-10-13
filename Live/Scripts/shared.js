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

function setTab(element, fn) {
    var $this = $(element);
    $('.tabButton').each(function (index, elem) {
        $(this).removeClass('selected');
        $($(this).attr("name")).css('display', 'none');
    });
    $this.addClass('selected');
    $($this.attr('name')).css('display', 'block');
    fn();
}

function applyEditables() {
    $('.edit').toggleClass('active');
    $('.edit a').toggleClass('active');
    $('.tabHeader').toggleClass('active');
    $('.fa-camera').toggleClass('active');
    var focus = false;
    $('[sc-data]').each(function (i, elm) {
        var $elm = $(elm);
        var $input = $('<div type="text" name="' + $elm.attr('sc-data') + '" contenteditable></div>');
        $input.data('view', $elm);
        
        $input.html(elm.innerHTML.trim());
        $input.css({
            'line-height': $elm.css('line-height')
        });
        $input.attr('class', $elm.attr('class'));
        $input.attr('sc-placeholder', $elm.attr('sc-placeholder'));
        $elm.replaceWith($input);
        if (!focus)
        {
            $input.focus();
            focus = true;
        }
    });
}

function commitEditables(uri) {
    var data = {};
    $('[contenteditable]').each(function (i, elm) {
        var $elm = $(elm);
        var content = elm.innerHTML;
        content = content
            .replace(/<div><br>/g, '<br>')
            .replace(/<div>/g, '\r\n')
            .replace(/<a>/g, '')
            .replace(/<\/a>/g, '')
            .replace(/<\/div>/g, '')
            .replace(/<br>/g, '\r\n');
        data[$elm.attr('name')] = content;
    });

    var jqxhr = $.ajax(
    {
        url: uri,
        data: data,
        type: 'post',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {

            $('[contenteditable]').each(function (i, elm) {
                var $elm = $(elm);
                var $original = $($elm.data().view[0]);
                var $last = $original.find(':last-child');
                if ($last.length == 0)
                {
                    $last = $original;
                }
                $last.text(data[$original.attr('sc-data')]);
                $elm.replaceWith($original);
            });

            $('.edit').toggleClass('active');
            $('.edit a').toggleClass('active');
            $('.tabHeader').toggleClass('active');
            $('.fa-camera').toggleClass('active');
        },
        error: function (data, textStatus, jqXHR) {
            var $error = $('<div class="error"><div class="close">&times;</div><i class="fa fa-exclamation-circle"></i><div class="message"></div></div>');
            var $edit = $('.edit');
            $error.find('.message').text(jqXHR.message);
            $error.find('.close').click(function () {
                $error.remove();
            });
            $error.css({
                top: '-999999px',
            });
            $('body').append($error);
            $error.css({
                top: '-' + $error.height() + 'px'
            });
            $error.animate({
                top: 0
            }, 1000);
        },
        headers: {
            Authorization: 'Bearer ' + window.sc_apiToken
        }
    });
}

function discardEditables() {
    $('.edit').toggleClass('active');
    $('.edit a').toggleClass('active');
    $('.tabHeader').toggleClass('active');
    $('.fa-camera').toggleClass('active');
    $('[contenteditable]').each(function (i, elm) {
        var $elm = $(elm);
        var $original = $elm.data();
        $elm.replaceWith($($original.view[0]));
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
