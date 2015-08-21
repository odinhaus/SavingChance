sc.controller('sc.Browse', ['$scope', '$window', function ($scope, $window, windowState) {
    $scope.tiles = [];
    $scope.grid = [];
    $scope.columnCount = 8;
    $scope.lastRow = addRow($scope.columnCount);
    $scope.grid.push($scope.lastRow);

    var maxRow = 0, lastRow = 0;

    function tileSort(x, y) {
        return y.size - x.size;
    };

    $scope.updateTiles = function () {
        $scope.columnWidth = $scope.bodyWidth / $scope.columnCount;
        $scope.rowHeight = $scope.columnWidth * (768 / 1024);
        var i = 0, j = 0;
        // update layout grid
        for (i; i < $scope.grid.length; i++)
        {
            var row = $scope.grid.length[i];
            row.height = $scope.rowHeight;
            row.top = i * $scope.rowHeight;
            for (j; j< row.columnCount; j++)
            {
                var col = row.columns[j];
                col.top = row.top;
                col.width = $scope.columnWidth;
                col.left = j * $scope.columnWidth;
                col.height = row.height;
                if (col.tile)
                {
                    col.tile.top = col.top;
                    col.tile.left = col.left;
                    col.tile.height = col.height;
                    col.tile.width = col.width;
                }
            }
        }
    };

    $scope.addTiles = function(tiles)
    {
        tiles.sort(tileSort);
        // algorithm:
        // last row is stored between updates, and is not incremented until all columns are occupied, even if rows below it are fully occupied
        // group by size, biggest to smallest
        // place all large tiles, no more than 1 in same vertical section, rotating from left|center|right aligned, starting with last row
        // place all medium tiles, starting from upper left of last row
        // place all small tiles, starting from upper left of last row
        // calculate last row
        var large = [];
        var med = [];
        var small = [];
        var i = 0;
        var largeSize = { w: $scope.columnWidth * 4, h: $scope.rowHeight * 4 };
        var medSize = { w: $scope.columnWidth * 2, h: $scope.rowHeight * 2 };
        var smallSize = { w: $scope.columnWidth, h: $scope.rowHeight };

        for(i; i < tiles.length; i++)
        {
            var tile = tiles[i];

            if (tile.size == 1)
                small.push(tile);
            else if (tile.size == 2)
                med.push(tile);
            else large.push(tile);
        }

        var largeCount = 0;

        i = 0;
        for(i; i < large.length; i++)
        {
            placeLargeTile(large[i], largeCount % 3);
            largeCount++;
        }
    }

    function placeTile(tile, position)
    {
        if (position == 0)
            placeTileLeft(tile);
        else if (position == 1)
            placeTileCenter(tile);
        else placeTileRight(tile);
    }

    function placeTileLeft(tile) {
        var rowIndex = lastRow;
        var row = null;
        do
        {
            row = $scope.grid[rowIndex];
            if (!row)
            {
                row = initRow(addRow($scope.columnCount), rowIndex);
                $scope.grid.push(row);
            }
            rowIndex++;
        } while (row.columns[0].isOccupied);
        var i = 0, j = 0;
        for(i; i < tile.size; i++)
        {
            var r = $scope.grid[row.rowIndex + i];
            if (!r) {
                r = initRow(addRow($scope.columnCount), row.rowIndex + i);
                $scope.grid.push(r);
            }
            for (j; j < tile.size; j++) {
                var col = r.columns[j];
                if (j == 0 && i == 0)
                {
                    col.tile = tile;
                    tile.rowIndex = r.rowIndex;
                    tile.columnIndex = j;
                    tile.row = r;
                }
                col.isOccupied = true;
            }
        }
    }


    function placeTileCenter(tile) {
    }

    function placeTileRight(tile) {
    }

    function initRow(row, rowIndex)
    {
        row.height = $scope.rowHeight;
        row.top = rowIndex * $scope.rowHeight;
        for (j; j < row.columnCount; j++) {
            var col = row.columns[j];
            col.top = row.top;
            col.width = $scope.columnWidth;
            col.left = j * $scope.columnWidth;
            col.height = row.height;
            if (col.tile) {
                col.tile.top = col.top;
                col.tile.left = col.left;
                col.tile.height = col.height;
                col.tile.width = col.width;
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

    var w = angular.element($window);
    w.bind('resize', function () {
        $scope.bodyWidth = w.innerWidth();
        $scope.updateTiles($scope.bodyWidth);
        $scope.$apply();
    });

    $scope.loadMore = function ()
    {
        $scope.bodyWidth = windowState.bodyWidth;
        var tileCount = windowState.columnCount * 3;
        var last = $scope.tiles.length;
        var tiles = [];
        for (var i = 1; i <= tileCount; i++) {
            var size = 1;

            if (i % 3 == 0)
            {
                size = 2;
            }
            else if (i % 7 == 0)
            {
                size = 4;
            }

            var tile = {
                image: last + i,
                title: 'Lorem epsum salts or something',
                caption: 'E plurubus unum',
                subTitle: 'All for one',
                href: '/' + i,
                size: size
            };

            tiles.push(tile);
            $scope.tiles.push(tile);
        }
        $scope.updateTiles($scope.bodyWidth, tiles);
    };
    

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
        return row;
    }
}]);