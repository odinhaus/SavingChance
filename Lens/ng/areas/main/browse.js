sc.controller('sc.Browse', ['$scope', '$window', 'appState', '$rootScope', function ($scope, $window, appState, $rootScope) {
    $scope.tiles = [];
    $scope.grid = [];
    $scope.columnCount = 8;

    var $selected = null;
    var w = angular.element($window);

    var isNavigating = false;
    $rootScope.$on('$locationChangeStart', function () {
        isNavigating = true;
    });
    $(window).scroll(function () {
        if (!isNavigating) {
            appState['browse'].windowState.scrollY = window.scrollY;
        }
    });

    updateWindowDimensions(w);
    
    w.bind('resize', function () {
        updateTileSizes();
    });

    var resizing = false;
    function updateTileSizes()
    {
        if (!resizing) {
            resizing = true;
            $scope.updateTiles(updateWindowDimensions(w));
            $scope.$apply();
            setTimeout(function () {
                if (!resizing) {
                    resizing = true;
                    $scope.updateTiles(updateWindowDimensions(w));
                    $scope.$apply();
                    resizing = false;
                }
            }, 700);
            resizing = false;
        }
    }

    function updateWindowDimensions(w)
    {
        var scrollbarAdjust = 0;
        if ($scope.grid.length == 0)
        {
            scrollbarAdjust = getScrollBarWidth();
        }
        $scope.bodyWidth = w.innerWidth() - scrollbarAdjust;
        $scope.bodyHeight = w.innerHeight();
        var columnCount = 8;
        if ($scope.bodyWidth <= 768)
        {
            columnCount = 4;
        }
        else if ($scope.bodyWidth <= 1024)
        {
            columnCount = 6;
        }
        var columnsChanged = $scope.columnCount != columnCount;
        $scope.columnCount = columnCount;
        $scope.columnWidth = $scope.bodyWidth / $scope.columnCount;
        $scope.rowHeight = $scope.columnWidth * (768 / 1024);
        return columnsChanged;
    }

    var maxRow = 0, lastRow = 0;

    $scope.scrollRight = function(tile)
    {
        scrollCarousel(tile, -1);
    }

    $scope.scrollLeft = function (tile)
    {
        scrollCarousel(tile , 1);
    }

    $scope.updateTiles = function (columnsChanged) {
        if (columnsChanged) {
            var tiles = $scope.tiles;
            $scope.grid = []; // dump the current layout, and re-layout the entire list
            maxRow = 0;
            lastRow = 0;
            $scope.addTiles(tiles);
        }
        else {
            var i = 0;
            // update layout grid
            for (i; i < $scope.grid.length; i++) {
                var j = 0;
                var row = $scope.grid[i];
                row.height = $scope.rowHeight;
                row.top = i * $scope.rowHeight;
                for (j; j < row.columnCount; j++) {
                    var col = row.columns[j];
                    col.top = row.top;
                    col.width = $scope.columnWidth;
                    col.left = j * $scope.columnWidth;
                    col.height = row.height;
                    if (col.tile) {
                        col.tile.top = col.top;
                        col.tile.left = col.left;
                        col.tile.height = col.height * col.tile.size;
                        col.tile.width = col.width * col.tile.size;
                        col.tile.element.css({
                            top: col.tile.top,
                            left: col.tile.left,
                            width: col.tile.width,
                            height: col.tile.height
                        });
                        updateStatus(col.tile);
                    }
                }
            }
        }
    };

    $scope.addTiles = function(tiles)
    {
        var i = 0;
        
        for(i; i < tiles.length; i++)
        {
            placeTile(tiles[i]);
        }
    }

    var isScrolling = false;
    function scrollCarousel(tile, modifier) {
        if (isScrolling) return;
        isScrolling = true;
        var $article = $("#" + tile.id);
        var size = { width: $article.width(), height: $article.height() };
        var $pages = $article.find('.carousel .carousel-page');
        var length = $pages.length;
        var current = 0;
        $pages.each(function (index, page) {
            if ($(page).hasClass('selected')) {
                current = index;
                return false; // break the each loop
            }
        });
        var next = modifier > 0
            ? current - modifier < 0 ? length - 1 : current - modifier
            : current - modifier >= length ? 0 : current - modifier;

        var $current = $($pages[current]);
        var $next = $($pages[next]);
        var startLeft = $current.position().left - modifier * size.width;
        var endLeftCurrent = $current.position().left + modifier * size.width;
        var endLeftNext = $current.position().left;

        initializePage($next, tile);

        $next.css({
            height: size.height + 'px',
            width: size.width + 'px',
            top: $current.position().top + 'px',
            left: startLeft + 'px',
            zindex: 0,
            display: 'inline-block'
        });

        $next.toggleClass('selected');

        setTimeout(function () {
            $next.css({ left: endLeftNext });
            $current.css({ left: endLeftCurrent, zindex: -1 });

            setTimeout(function () {
                $current.toggleClass('selected');
                $current.css({ display: 'none' });
                $next.css('height', '');
                $next.css('width', '');
                isScrolling = false;
            }, 250);
        }, 250);
    }

    function initializePage($page, tile) {
        if ($page.hasClass('map')) {
            var setLocation = function (location) {
                var latLng = new google.maps.LatLng(location.latitude, location.longitude);
                var mapProp = {
                    center: latLng,
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = tile.map;
                if (!map) {
                    tile.map = new google.maps.Map($page[0], mapProp);
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: tile.map,
                        title: tile.title + '\r\n' + tile.address + '\r\n' + 'lat: ' + location.latitude + ', long: ' + location.longitude
                    });
                    var contentString = '<div id="content" style="color: #000">' +
                                          '<div id="siteNotice"></div>' +
                                          '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
                                              '<div id="bodyContent">' +
                                                '<p style="color: #000"><b style="color: #000">Uluru</b>, also referred to as <b style="color: #000">Ayers Rock</b>, is a large ' +
                                                'sandstone rock formation in the southern part of the ' +
                                                'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
                                                'south west of the nearest large town, Alice Springs; 450&#160;km ' +
                                                '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
                                                'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
                                                'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
                                                'Aboriginal people of the area. It has many springs, waterholes, ' +
                                                'rock caves and ancient paintings. Uluru is listed as a World ' +
                                                'Heritage Site.</p>' +
                                                '<p style="color: #000">Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
                                                'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
                                                '(last visited June 22, 2009).</p>' +
                                              '</div>' +
                                          '</div>';

                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    marker.addListener('click', function () {
                        infowindow.open(tile.map, marker);
                    });

                    tile.location = location;
                }
                else {
                    tile.map.setCenter(latLng);
                }
                google.maps.event.addDomListenerOnce(tile.map, 'idle', function () {
                    google.maps.event.addDomListener(window, 'resize', function () {
                        tile.map.setCenter(latLng);
                    });
                });
            };

            if (!tile.location) {
                getLocation(tile.address, setLocation);
            }
            else {
                setLocation(tile.location);
            }
        }
    }

    function getScrollBarWidth() {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);

        document.body.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2) w2 = outer.clientWidth;

        document.body.removeChild(outer);

        return (w1 - w2);
    };

    function placeTile(tile) {
        var rowIndex = lastRow;
        var row = null;
        var col = -1;
        // find next vacant top 
        do
        {
            row = $scope.grid[rowIndex]; // get the row
            if (!row)
            {   // row doesn't exist, so create a new one, and initialize it
                row = initRow(addRow($scope.columnCount), rowIndex);
                $scope.grid.push(row); // put it into the binding $scope
            }
            col = tryPlaceTile(row, tile); // try to place the tile in this row
            rowIndex++; // increment the row index pointer
        } while (col == -1); // -1 means it won't fit on this row, try the next row

        var i = 0;
        var $section = $('#thumbnails');
        for(i; i < tile.size; i++)
        {
            j = col; // start at the open column
            var r = $scope.grid[row.rowIndex + i];
            if (!r) {
                // row doesn't exist, so add and init a new row
                r = initRow(addRow($scope.columnCount), row.rowIndex + i);
                $scope.grid.push(r);
            }

            for (j; j < col + tile.size; j++) {
                var column = r.columns[j];
                if (j == col && i == 0)
                {
                    // upper left corner cell is the tile's anchor position
                    column.tile = tile;
                    tile.rowIndex = r.rowIndex;
                    tile.columnIndex = j;
                    tile.row = r;
                    tile.column = column;
                    tile.top = row.top;
                    tile.left = column.left;
                    tile.height = row.height * tile.size;
                    tile.width = column.width * tile.size;
                    if ($section.height() < tile.top + tile.height)
                    {
                        $section.height(tile.top + tile.height);
                    }
                }
                column.isOccupied = true; // mark it full
            }
        }

        lastRow = updateLastRow();
    }

    function updateLastRow()
    {
        do {
            var row = $scope.grid[lastRow];

            if (!row) {   // row doesn't exist, so create a new one, and initialize it
                row = initRow(addRow($scope.columnCount), lastRow);
                $scope.grid.push(row); // put it into the binding $scope
                return lastRow;
            }

            var j = 0;
            for(j; j < row.columnCount; j++)
            {
                if (!row.columns[j].isOccupied)
                    return lastRow;
            }
            lastRow++;
        } while (true);
    }

    function tryPlaceTile(row, tile)
    {
        var i = 0, j = 0;
        var col = 0;

        // try each column in the row, based on tile's size
        for (j; j < row.columnCount; j++) {
            if (willFit(j, row, tile))
            {
                col = j;
                return col; // the tile can be placed at this location
            }
        }

        return -1; // the tile can't fit in this row
    }

    function willFit(col, row, tile)
    {
        if (col + tile.size <= row.columnCount) // if the tile is too wide, it will never fit, so just bail
        {
            var i = row.rowIndex;
            for (i; i < row.rowIndex + tile.size; i++) {
                var j = col;
                var aRow = $scope.grid[i];
                if (aRow) { // the row may not exist, if not, then we don't need to test it - it will be added later
                    for (j; j < col + tile.size; j++) {
                        if (aRow.columns[j].isOccupied) // if the column is filled, we bail
                        {
                            return false;
                        }
                    }
                }
            }
        }
        else return false; // too wide to fit from this column
        
        return true; // we never bailed, so it must fit at the given position
    }

    function initRow(row, rowIndex)
    {
        row.height = $scope.rowHeight;
        row.top = rowIndex * $scope.rowHeight;
        row.rowIndex = rowIndex;
        for (var j = 0; j < row.columnCount; j++) {
            var col = row.columns[j];
            col.top = row.top;
            col.width = $scope.columnWidth;
            col.left = j * $scope.columnWidth;
            col.height = row.height;
            if (col.tile) {
                col.tile.top = col.top;
                col.tile.left = col.left;
                col.tile.height = col.height * tile.size;
                col.tile.width = col.width * tile.size;
            }
        }
        return row;
    }

    function rowIsFull(row)
    {
        var i = 0;
        for(i; i< row.columns.length; i++)
        {
            if (!row.columns[i].isOccupied) return false;
        }
        return true;
    }

    $scope.loadMore = function ()
    {
        var tileCount = Math.ceil($scope.columnCount * ($scope.bodyHeight / $scope.rowHeight));
        var last = $scope.tiles.length;
        if (last > 0)
        {
            var row = $scope.grid[lastRow];
            if ($scope.bodyHeight + w[0].pageYOffset < row.top) return;
        }
        var tiles = [];
        for (var i = 1; i <= tileCount; i++) {
            var size = 2;

            if (i % 7 == 0)
            {
                size = 4;
            }
            var expires = new Date(Date.now() + Math.random() * 10);
            var created = new Date(Date.now() - Math.random() * 10);
            var tile = {
                image: last + i,
                title: 'Lorem epsum salts or something',
                caption: 'E plurubus unum',
                subTitle: 'All for one',
                href: '/' + i,
                size: size,
                id: last + i,
                expires: expires,
                created: created,
                address: '22503 Bergman Drive, Magnolia TX 77355',
                goal: Math.random() * 10000,
                total: Math.random() * 10000,
                img: i % 3 == 0 
                    ? 'http://www.prestonspeaks.com/wp-content/uploads/2012/11/Lucian-the-awesome-Husky.jpg'
                    : i % 5 == 0
                        ? 'https://dogsinmind.files.wordpress.com/2015/08/dove.jpg'
                        : 'http://dustytrailshorserescue.org/wp-content/uploads/2011/07/Stella-before.jpg',
                sponsor: 'Houston Boxer Rescue',
                sponsorHandle: '@HBR',
                lastUpdate: {
                    date: Date.now(),
                    value: 'I rescued this female Saint Bernard from the middle of no where off '
                           + 'the I-15 & Nicholas rd in a very rural part of the area. When I arrived '
                           + 'on seen than the dog was laying there dying with no one & nothing. '
                           + 'She has extensive wounds to her back side & full of maggots. Thousands '
                           + 'of ticks all over her body. She is at the Arlington Animal Hospital In Riverside, Ca. '
                           + 'She is a critical situation rite now & needs a village of help. The bill is already '
                           + 'at $3,115.91 to preform current life saving services. Please Help..'
                }
            };

            tiles.push(tile);
            $scope.tiles.push(tile);
        }

        $scope.addTiles(tiles);
        appState['browse'].pageState.tiles = $scope.tiles;
    };

    function isElementInViewport(el) {

        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    }

    /*
    $scope.show = function(tile)
    {
        if (tile.isOpen) return;

        tile.isOpen = true;
        var $element = $('#' + tile.id).parent();

        var $clone = $($element.clone()[0].outerHTML).insertAfter($element);
        $clone.attr('id', tile.id + '_clone_wrapper');
        $clone.addClass('active');
        var $article = $($clone.children()[0]);
        $article.attr('id', tile.id + '_clone');
        $clone.tile = tile;
        $selected = $clone;

        var yOffset = window.pageYOffset - $('#header').height();
        var width = window.innerWidth;
        var scale = width / tile.width;
        var height = tile.height * scale;
        var settings = {
            queue: false,
            duration: 0,
            complete: function () {
                
                $('body').css({ overflowY: 'hidden' });
                $clone.find('.content').css('display', 'block');
                var $closeButton = $clone.find('.closeButton');
                $closeButton.toggleClass('hidden');
                setTimeout(function () {
                    $clone.absPos = $clone.position();
                    $clone.absSize = { width: $clone.width(), height: $clone.height() };
                    $clone.addClass('notrans');
                    $clone.css({ position: 'fixed', left: 0, right: 0, bottom: 0, top: 0, width: '', height: '' });
                    setTimeout(function () { $clone.removeClass('notrans'); window.history.pushState({ page: tile.id }, "Details", "?" + tile.id); }, 400);
                },800); // hack to allow animation to complete prior to removing clone
                $closeButton.click(function () {
                    var $clone = $selected;
                    var settings = {
                        queue: false,
                        duration: 0,
                        complete: function () {
                            $selected = null;
                            $('body').css({ overflowY: 'auto' });
                            $clone.css({ zindex: 0 });
                            tile.isOpen = false;
                            setTimeout(function () {
                                $clone.remove();
                            }, 600); // hack to allow animation to complete prior to removing clone
                        }
                    };
                    $clone.addClass('notrans');
                    $clone.find('.content').css('display', 'none');
                    $clone.css({
                        position: 'absolute',
                        left: $clone.absPos.left,
                        right: '',
                        bottom: '',
                        top: $clone.absPos.top,
                        width: $clone.absSize.width,
                        height: $clone.absSize.height
                    });
                    setTimeout(function () {
                        $clone.removeClass('notrans');
                        $clone.animate({
                            top: $clone.tile.top,
                            left: $clone.tile.left,
                            width: $clone.tile.width,
                            height: $clone.tile.height
                        }, settings);
                    }, 200);
                    
                });
            }
        };

        $clone.css({ zIndex: 1000000 });
        $clone.animate({
            top: yOffset,
            left: 0,
            width: width,
            height: height
        }, settings, 1200);
    }
    */

    function addRow(columnCount)
    {
        return newRow(maxRow++, columnCount);
    }

    function newRow(rowIndex, columnCount)
    {
        var row = {
            rowIndex: rowIndex,
            height: null,
            top: null,
            columnCount: columnCount,
            columns: []
        };
        var i = 0;
        for(i; i< columnCount; i++)
        {
            row.columns[i] = {
                columnIndex: i,
                isOccupied: false,
                tile: null,
                top: null,
                left: null,
                width: null,
                height: null
            };
        }
        maxRow = rowIndex;
        return row;
    }

    
}])
.directive('tileRendered', function () {
    return function (scope, element, attrs) {
        var $element = $(element);
        var tile = scope.tile;
        tile.element = $element;
        $element.css({
            top: tile.top,
            left: tile.left,
            width: tile.width,
            height: tile.height
        });
        updateStatus(tile, $element);
    };
});

function updateStatus(tile, $wrapper) {
    updateStatusLinear(tile, $wrapper);
}

function updateStatusLinear(tile, $wrapper)
{
    if (!$wrapper)
    {
        $wrapper = $('#' + tile.id).parent();
    }
    var $goalCanvas = $wrapper.find('.status_bar.goal');
    var $timeCanvas = $wrapper.find('.status_bar.time');
    var goalCtx = $goalCanvas[0].getContext("2d");
    var timeCtx = $timeCanvas[0].getContext("2d");

    goalCtx.clearRect(0, 0, $goalCanvas[0].width, $goalCanvas[0].height);
    timeCtx.clearRect(0, 0, $timeCanvas[0].width, $timeCanvas[0].height);

    var goalSize = { width: $goalCanvas.parent().width() - 80, height: $goalCanvas.parent().height() };
    var timeSize = { width: $timeCanvas.parent().width() - 80, height: $timeCanvas.parent().height() };

    $goalCanvas.attr('width', goalSize.width + 50);
    $goalCanvas.attr('height', goalSize.height);
    $timeCanvas.attr('width', timeSize.width + 50);
    $timeCanvas.attr('height', timeSize.height);

    var timespanMS = tile.expires - tile.created;
    var timespanDays = Math.ceil(timespanMS / (1000 * 60 * 60 * 24));
    var currentTimeSpanMS = Date.now() - tile.created;
    var timePercent = 0.3;// currentTimeSpanMS / timespanMS;
    var fundingPercent = 0.42;//tile.total / tile.goal;

    var outerH_Time = timeSize.height - 4;
    var outerH_Goal = goalSize.height - 4;

    var innerH_Time = outerH_Time - 4;
    var innerH_Goal = outerH_Goal - 4;

    goalCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    timeCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';

    goalCtx.fillRect(0, (goalSize.height - outerH_Goal) / 2, goalSize.width, outerH_Goal);
    timeCtx.fillRect(0, (timeSize.height - outerH_Time) / 2, timeSize.width, outerH_Time);


    goalCtx.fillStyle = 'rgba(100, 143, 100, 0.9)';
    timeCtx.fillStyle = 'rgba(247, 114, 36, 0.9)';
    goalCtx.fillRect(2, (goalSize.height - innerH_Goal) / 2, goalSize.width * fundingPercent - 4, innerH_Goal);
    timeCtx.fillRect(2, (timeSize.height - innerH_Time) / 2, timeSize.width * timePercent - 4, innerH_Time);

    goalCtx.fillStyle = '#fff';
    timeCtx.fillStyle = '#fff';
    goalCtx.font = outerH_Goal + "px sans serif";
    timeCtx.font = outerH_Time + "px sans serif";
    goalCtx.fillText('$' + tile.goal.toFixed(0), goalSize.width + 4, outerH_Goal);
    var days = timespanDays + ' Day' + (timespanDays > 1 ? 's' : '');
    timeCtx.fillText(days, timeSize.width + 4, outerH_Time);
}

//function updateStatusRadial(tile, $wrapper)
//{
//    var $canvas = $wrapper.find('.status.radial');

//    var ctx = $canvas[0].getContext("2d");
//    var size = { width: $canvas.width(), height: $canvas.height() };
//    $canvas.attr('width', size.width + 'px');
//    $canvas.attr('height', size.height + 'px');

//    var timespanMS = tile.expires - tile.created;
//    var currentTimeSpanMS = Date.now() - tile.created;
//    var timePercent = 0.3;// currentTimeSpanMS / timespanMS;
//    var fundingPercent = 0.42;//tile.total / tile.goal;

//    //var gradient = ctx.createLinearGradient(
//    //    0, 
//    //    size.height,
//    //    size.width, 
//    //    0);

//    //gradient.addColorStop("0", "#fff");
//    //gradient.addColorStop("0.5", "#fff");
//    //gradient.addColorStop("0.9", "#b00");
//    //gradient.addColorStop("1.0", "#700");

//    var outerThickness = 25;
//    var outerInnerThickness = 17;
//    var innerThickness = 25;
//    var innerInnerThickness = 17;
//    var outerRadius = size.width - outerThickness / 2;
//    var innerRadius = outerRadius - outerThickness / 2 - innerThickness / 2 - 3;
//    var center = { top: size.height, left: size.width };
//    var fullBar = Math.PI / 2;
//    var outerBar = fullBar * timePercent;
//    var innerBar = fullBar * fundingPercent;


//    //ctx.beginPath();
//    //ctx.arc(center.left, center.top, (outerRadius + innerRadius) / 2, Math.PI, Math.PI + Math.PI / 2);
//    //ctx.strokeStyle = "#333";
//    //ctx.lineWidth = outerThickness + innerThickness + 4;
//    //ctx.stroke();

//    ctx.beginPath();
//    ctx.arc(center.left, center.top, outerRadius, Math.PI, Math.PI + Math.PI / 2);
//    ctx.strokeStyle = "#fffdfc";
//    ctx.lineWidth = outerThickness;
//    ctx.stroke();

//    ctx.beginPath();
//    ctx.arc(center.left, center.top, outerRadius, Math.PI, Math.PI + outerBar);
//    ctx.strokeStyle = "#F37227";
//    ctx.lineWidth = outerInnerThickness;
//    ctx.stroke();

//    ctx.beginPath();
//    ctx.strokeStyle = "#fffdfc";
//    ctx.lineWidth = innerThickness;
//    ctx.arc(center.left, center.top, innerRadius, Math.PI, Math.PI + Math.PI / 2);
//    ctx.stroke();

//    ctx.beginPath();
//    ctx.arc(center.left, center.top, innerRadius, Math.PI, Math.PI + innerBar);
//    ctx.strokeStyle = "#648f64";
//    ctx.lineWidth = innerInnerThickness;
//    ctx.stroke();
//}