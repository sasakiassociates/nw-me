/**
 * User: kgoulding
 * Date: 5/2/2014
 * Time: 10:02 AM
 */
SAS = (typeof SAS === 'undefined') ? {} : SAS;
var gui = require('nw.gui');
(function () { // self-invoking function
    /**
     * @class SAS.NwFileHandler
     **/
    SAS.NwFileHandler = function (acceptArr, menuName, menu, readonly) {
        var _self = this;

        //region private fields and methods
        var _onSaveDataRequested = function () {
        };
        var _onLoadData = function () {
        };
        var _onChooseFile = null;

        var _lastPath = null;
        var _$loadInput;
        var _$saveInput;
        var _menu = menu || new gui.Menu({type: 'menubar'});
        var _menuName = menuName || 'File';
        var _readonly = !!readonly;

        var _init = function () {
            var acceptStr = acceptArr.join(',');

            _$loadInput = $('<input type="file" style="display:none"/>').attr('accept', acceptStr).appendTo('body');
            _$saveInput = $('<input type="file" nwsaveas style="display:none"/>').attr('accept', acceptStr).appendTo('body');

            var fileMenu = new gui.Menu();
            _menu.append(new gui.MenuItem({
                label: _menuName,
                submenu: fileMenu
            }));

            fileMenu.append(new gui.MenuItem({
                label: 'Load',
                click: function () {
                    _load();
                }
            }));

            if (!_readonly) {
                fileMenu.append(new gui.MenuItem({
                    label: 'Save',
                    click: function () {
                        _save();
                    }
                }));

                fileMenu.append(new gui.MenuItem({
                    label: 'Save As...',
                    click: function () {
                        _save(true);
                    }
                }));
            }

            gui.Window.get().menu = _menu;

            _$saveInput.on('change', function () {
                var file = $(this).val();
                _saveFile(file);
                $(this).val('');//reset it for next time (otherwise it won't trigger 'change' for the same file)
            });

            _$loadInput.on('change', function () {
                var file = $(this).val();
                _loadFile(file);
                $(this).val('');//reset it for next time (otherwise it won't trigger 'change' for the same file)
            });

            $(document).keyup(function (event) {
                if (event.which == 79 && event.ctrlKey) {//Ctrl + o
                    _load();
                } else if (event.which == 83 && event.ctrlKey) {//Ctrl + s
                    _save(event.shiftKey);
                }
            });
        };

        var _displayUpdate = function (message, type) {
            var $msgDiv = $('<div class="message">').text(message).appendTo('body');
            setTimeout(function () {
                $msgDiv.remove();
            }, 4000);
        };

        var _save = function (saveAs) {
            if (saveAs || !_lastPath) {
                _$saveInput.click();
            }
            if (_lastPath && !saveAs) {
                _saveFile(_lastPath);
            }
        };
        var _load = function () {
            _$loadInput.click();
        };

        var _saveFile = function (path) {
            _lastPath = path;
            var fs = require('fs');
            _onSaveDataRequested(function (data) {
                var fileContents = data;
                if (typeof data !== 'string') {
                    fileContents = JSON.stringify(data, null, 2);
                }
                fs.writeFile(path, fileContents, function (err) {
                    if (err) {
                        alert('Problem saving file: ' + err);
                    } else {
                        _displayUpdate('Saved as ' + path);
                    }
                });
            });
        };

        var _loadFile = function (path) {
            _lastPath = path;
            if (_onChooseFile) {
                _onChooseFile(path);
                return;
            }
            var fs = require('fs');
            fs.readFile(path, function (err, data) {
                if (err) {
                    alert(err);
                } else {
                    _onLoadData(JSON.parse(data));
                }
            });
        };
        //endregion

        //region protected fields and methods (use '_' to differentiate).
        //this._getFoo = function() { ...
        //endregion

        //region public API
        /**
         * @param {Function} fn
         */
        this.onSaveDataRequested = function (fn) {
            _onSaveDataRequested = fn;
        };

        /**
         * @param {Function} fn
         */
        this.onLoadData = function (fn) {
            _onLoadData = fn;
        };

        /**
         * @param {Function} fn
         */
        this.onChooseFile = function (fn) {
            _onChooseFile = fn;
        };

        this.processFile = function (file) {
            _loadFile(file);
        };
        //endregion

        _init();
    }
})();