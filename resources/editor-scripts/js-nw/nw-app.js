var gui = require('nw.gui');
const fs = require("fs");
const nwme = require('nw-me');
const menu = new gui.Menu({type: 'menubar'});

const versionHandler = new SAS.NwFileHandler(['.json'], 'Versions', menu);

versionHandler.onChooseFile(function (json) {
    const data = JSON.parse(fs.readFileSync(json));
    restoreFromData(data);
});

versionHandler.onSaveDataRequested(function (callback) {
    callback(getSaveData());
});

const addMenu = function (label, buttons) {
    const subMenu = new gui.Menu();
    menu.append(new gui.MenuItem({
        label: label,
        submenu: subMenu
    }));
    buttons.forEach(function (button, i) {
        subMenu.append(new gui.MenuItem({
            label: button.label,
            click: button.click
        }));
    });
};

addMenu('Edit', [
    {
        label: 'Edit Mode',
        click: function () {
            console.log('editMode SET');
            global.me_editMode = true;
            const win = gui.Window.get();
            win.reload();
        }
    },
    {
        label: 'View Mode',
        click:  function () {
            const data = getSaveData();
            nwme.saveHtmlFile('.' + window.location.pathname, data, function () {
                const win = gui.Window.get();
                global.me_editMode = false;
                win.reload();
            });
        }
    },
    {
        label: 'Discard Edits',
        click: function () {
            const win = gui.Window.get();
            global.me_editMode = false;
            win.reload();
        }
    }
]);

addMenu('Browser', [
    {
        label: 'Back',
        click: function () {
            const win = gui.Window.get();
            win.window.history.back();
        }
    },
    {
        label: 'Forward',
        click:  function () {
            const win = gui.Window.get();
            win.window.history.forward();
        }
    }
]);

addMenu('Export', [
    {
        label: 'Flatten',
        click: function () {
            //TODO
        }
    }
]);


gui.Window.get().menu = menu;