sc.controller('sc.Browse', ['$scope', '$window', function ($scope, $window, windowState) {
    $scope.tiles = [];
    $scope.grid = [];
    $scope.columnCount = 8;

    var $selected = null;
    var w = angular.element($window);
    w[0].onpopstate = function (event) {
        var pageState = event.state;
        if (pageState)
        {

        }
    };

    updateWindowDimensions(w);
    var resizing = false;
    w.bind('resize', function () {
        if (!resizing) {
            resizing = true;
            $scope.updateTiles(updateWindowDimensions(w));
            $scope.$apply();
            //setTimeout(function () {
            //    $scope.updateTiles(updateWindowDimensions(w));
            //    $scope.$apply();
            //}, 2000);
            resizing = false;
        }
    });

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
        $scope.columnWidth = $scope.bodyWidth / $scope.columnCount;// Math.floor($scope.bodyWidth / $scope.columnCount);
        $scope.rowHeight = $scope.columnWidth * (768 / 1024);//Math.floor($scope.columnWidth * (768 / 1024));
        return columnsChanged;
    }

    var maxRow = 0, lastRow = 0;

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
                    }
                }
            }
        }


    };

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

    $scope.addTiles = function(tiles)
    {
        var i = 0;
        
        for(i; i < tiles.length; i++)
        {
            placeTile(tiles[i]);
        }
    }

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

            var tile = {
                image: last + i,
                title: 'Lorem epsum salts or something',
                caption: 'E plurubus unum',
                subTitle: 'All for one',
                href: '/' + i,
                size: size,
                id: last + i,
                img: i % 3 == 0 
                    ? 'http://www.prestonspeaks.com/wp-content/uploads/2012/11/Lucian-the-awesome-Husky.jpg'
                    : i % 5 == 0
                        ? 'https://dogsinmind.files.wordpress.com/2015/08/dove.jpg'
                        : 'http://dustytrailshorserescue.org/wp-content/uploads/2011/07/Stella-before.jpg'
            };

            tiles.push(tile);
            $scope.tiles.push(tile);
        }

        $scope.addTiles(tiles);
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
                    setTimeout(function () { $clone.removeClass('notrans');}, 400);
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
        }, settings);
    }

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
    };
});