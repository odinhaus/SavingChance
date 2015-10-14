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

var isShortuctsOpen = false;
function toggleShortcuts() {
    var $search = $('#search-form');
    var $popup = $('#shortcuts');
    if (isShortuctsOpen) {
        isShortuctsOpen = false;
        $popup.css('display', 'none');
    }
    else {
        var top = $search.offset().top + $search.height();
        var left = 0;
        var width = $search.width();
        $popup.css({ display: 'block', top: top + 'px', left: left + 'px', width: width + 'px' });
        isShortuctsOpen = true;
    }
}

function addTerm(elm)
{
    $('#search').val($('#search').val() + ' ' + $(elm).text());
    toggleShortcuts();
    $('#search').focus();
    event.preventDefault();
}

function doSearch() {

    var query = $('#search-form').serializeArray();
    var queryPath = "/" + query[0].value.trim(); //query[0].value ? "/tags/" + query[0].name + "=" + encodeURIComponent(query[0].value) : "/";
    if (query[0].value.trim().indexOf('#') === 0)
    {
        var tags = query[0].value.trim().replace(/,/g, ' ').split(' ');
        queryPath = "/tags";
        $(tags).each(function (i, elm) {
            if(elm.length > 0)
                queryPath += "/" + elm.replace('#','');
        });
    }
    window.location.assign(queryPath);
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

function applyEditables(callback) {
    $('.edit a').toggleClass('active');
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

    if (callback) callback();
}

function commitEditables(uri, callback) {
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

            applyUpdates(data);

            $('.edit a').toggleClass('active');
            if (callback) callback();
        },
        error: function (data, textStatus, jqXHR) {
            var message = "An unexpected error occurred.";
            if (data.responseJSON != undefined) {
                message = data.responseJSON.Message;
            }
            else if (jqXHR.responseText != undefined) {
                message = jqXHR.responseText;
            }
            else if (data.statusText != undefined) {
                message = data.statusText;
            }
            showError(message);
        },
        headers: {
            Authorization: 'Bearer ' + window.sc_apiToken
        }
    });
}

function applyUpdates(data)
{
    $('[sc-data-attr]').each(function (i, elm) {
        var $elm = $(elm);
        var split = $elm.attr('sc-data-attr').split(':');
        $elm.attr(split[0], data[split[1]]);
    });

    $('[sc-data-noedit]').each(function (i, elm) {
        var $elm = $(elm);
        var formatter = $elm.attr('sc-data-format');
        if (!formatter)
            formatter = 'function (data) { return data; }';
        var value = data[$elm.attr('sc-data-noedit')];
        if (value != undefined) {
            value = eval('('+ formatter + ')')(value);
            $elm.text(value);
        }
    });
}

function showError(message)
{
    var $error = $('<div class="error"><div class="close">&times;</div><i class="fa fa-exclamation-circle"></i><div class="message"></div></div>');
    $error.find('.message').text(message || "An unexpected error occurred.");
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
}

function discardEditables(callback) {
    $('.edit a').toggleClass('active');
    $('[contenteditable]').each(function (i, elm) {
        var $elm = $(elm);
        var $original = $elm.data();
        $elm.replaceWith($($original.view[0]));
    });

    if (callback) callback();
}

$('#navButton').click(function () {
    $('#nav').toggleClass('open');
    $('#navTool').toggleClass('active');
});

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});
