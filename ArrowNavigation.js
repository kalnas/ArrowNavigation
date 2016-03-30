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

    function getLocation(elm) {
        var coords = elm.getAttribute('data-coords').split(',');
        return { col: Number(coords[0]), row: Number(coords[1]) };
    }

    function focusNode(col, row) {
        var node = document.querySelector('input[data-coords="' +  col + ',' + row +'"]');

        if (node) {
            node.focus();
        }

        return document.activeElement === node;
    }

    function compare(a, b) {
        return a - b;
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

        rowOffsets.sort(compare);
        colOffsets.sort(compare);
    };

    instance.keyEvent = function(e) {
        var KEY_LEFT = 37,
            KEY_UP = 38,
            KEY_RIGHT = 39,
            KEY_DOWN = 40;

        if ([KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN].indexOf(e.which) === -1) {
            return;
        }

        var location = getLocation(this),
            colIndex = colOffsets.indexOf(location.col),
            rowIndex = rowOffsets.indexOf(location.row),
            receivedFocus = false;

        switch (e.which) {
            case KEY_LEFT:
                while (!receivedFocus && colIndex > 0) {
                    colIndex--;
                    receivedFocus = focusNode(colOffsets[colIndex], location.row);
                }

                break;
            case KEY_UP:
                while (!receivedFocus && rowIndex > 0) {
                    rowIndex--;
                    receivedFocus = focusNode(location.col, rowOffsets[rowIndex]);
                }

                break;
            case KEY_RIGHT:
                while (!receivedFocus && colIndex < colOffsets.length) {
                    colIndex++;
                    receivedFocus = focusNode(colOffsets[colIndex], location.row);
                }

                break;
            case KEY_DOWN:
                while (!receivedFocus && rowIndex < rowOffsets.length) {
                    rowIndex++;
                    receivedFocus = focusNode(location.col, rowOffsets[rowIndex]);
                }

                break;
        }

        if (receivedFocus) {
            e.preventDefault();
        }
    };

    return instance;
})();
