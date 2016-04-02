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

    function focusNode(col, row) {
        var node = document.querySelector(`input[data-coords="${col},${row}"]`);

        if (node) {
            node.focus();
        }

        return document.activeElement === node;
    }

    function compare(a, b) {
        return a - b;
    }

    Array.prototype.addFuzzyUnique = function(value, tolerance) {
        value = Math.round(value);
        for(var i = 0; i < this.length; i++) {
            if (Math.abs(this[i] - value) <= tolerance) {
                return this[i];
            }
        }

        this.push(value);
        return value;
    };

    var tolerance_ = 0;
    var debug_ = false;
    instance.updateOffsets = function() {
        rowOffsets = [];
        colOffsets = [];

        [].forEach.call(document.querySelectorAll('input'), function(node) {
            var coords = offset(node);
            coords.y = rowOffsets.addFuzzyUnique(coords.y, tolerance_);
            coords.x = colOffsets.addFuzzyUnique(coords.x, tolerance_);

            node.setAttribute('data-coords', coords.x + ',' + coords.y);
            !debug_ || (node.value = coords.x + ',' + coords.y);
            node.addEventListener("keydown", instance.keyEvent);
        });

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

        var coords = this.getAttribute('data-coords').split(','),
            col = Number(coords[0]),
            row = Number(coords[1]),
            colIndex = colOffsets.indexOf(col),
            rowIndex = rowOffsets.indexOf(row),
            receivedFocus = false;

        switch (e.which) {
            case KEY_LEFT:
                while (!receivedFocus && colIndex > 0) {
                    colIndex--;
                    receivedFocus = focusNode(colOffsets[colIndex], row);
                }

                break;
            case KEY_UP:
                while (!receivedFocus && rowIndex > 0) {
                    rowIndex--;
                    receivedFocus = focusNode(col, rowOffsets[rowIndex]);
                }

                break;
            case KEY_RIGHT:
                while (!receivedFocus && colIndex < colOffsets.length) {
                    colIndex++;
                    receivedFocus = focusNode(colOffsets[colIndex], row);
                }

                break;
            case KEY_DOWN:
                while (!receivedFocus && rowIndex < rowOffsets.length) {
                    rowIndex++;
                    receivedFocus = focusNode(col, rowOffsets[rowIndex]);
                }

                break;
        }

        if(receivedFocus) {
            e.preventDefault();
        }
    };

    instance.setup = function(tolerance, debug) {
        tolerance_ = tolerance;
        debug_ = debug;
    };

    return instance;
})();
