var ArrowNavigation = (function() {
    var instance = {};
    var rowOffsets, colOffsets;

    function offset(elem) {
        var docElem = window.document.documentElement,
            box = elem.getBoundingClientRect();

        return {
            x: box.left + ( window.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 ),
            y: box.top  + ( window.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 )
        };
    }

    instance.updateOffsets = function() {
        var rowOffsetsSet = new Set(),
            colOffsetsSet = new Set();

        [].forEach.call(document.querySelectorAll('input'), function(node) {
            var coords = offset(node);
            rowOffsetsSet.add(coords.y);
            colOffsetsSet.add(coords.x);

            node.setAttribute('data-coords', coords.x + ',' + coords.y);
            node.addEventListener("keydown", instance.keyEvent);
        });

        rowOffsets = [...rowOffsetsSet];
        colOffsets = [...colOffsetsSet];

        rowOffsets.sort(function(a, b) { return a - b; });
        colOffsets.sort(function(a, b) { return a - b; });
    };

    instance.keyEvent = function(e) {
        var KEY_LEFT = 37,
            KEY_UP = 38,
            KEY_RIGHT = 39,
            KEY_DOWN = 40;

        if ([KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN].indexOf(e.which) === -1) {
            return;
        }

        var coords = this.getAttribute('data-coords').split(','),
            col = Number(coords[0]),
            row = Number(coords[1]),
            colIndex = colOffsets.indexOf(col),
            rowIndex = rowOffsets.indexOf(row),
            node;

        function getNode(col, row) {
            return document.querySelector('input[data-coords="' +  col + ',' + row +'"]');
        }

        switch (e.which) {
            case KEY_LEFT:
                while (!node && colIndex > 0) {
                    colIndex--;
                    node = getNode(colOffsets[colIndex], row);
                }

                break;
            case KEY_UP:
                while (!node && rowIndex > 0) {
                    rowIndex--;
                    node = getNode(col, rowOffsets[rowIndex]);
                }

                break;
            case KEY_RIGHT:
                while (!node && colIndex < colOffsets.length) {
                    colIndex++;
                    node = getNode(colOffsets[colIndex], row);
                }

                break;
            case KEY_DOWN:
                while (!node && rowIndex < rowOffsets.length) {
                    rowIndex++;
                    node = getNode(col, rowOffsets[rowIndex]);
                }

                break;
        }

        if (node) {
            node.focus();
            e.preventDefault();
        }
    };

    instance.setup = function() {
        window.onresize = instance.updateOffsets;
        instance.updateOffsets();
    };

    return instance;
})();
