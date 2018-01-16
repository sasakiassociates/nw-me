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


const editMenu = new gui.Menu();
menu.append(new gui.MenuItem({
    label: 'Edit',
    submenu: editMenu
}));

editMenu.append(new gui.MenuItem({
    label: 'Edit Mode',
    key: '1',//not working...
    modifiers: "ctrl",
    click: function () {
        console.log('editMode SET');
        global.me_editMode = true;
        const win = gui.Window.get();
        win.reload();
    }
}));
editMenu.append(new gui.MenuItem({
    label: 'View Mode',
    key: '2',//not working...
    modifiers: "ctrl",
    click: function () {
        const data = getSaveData();
        nwme.saveHtmlFile('.' + window.location.pathname, data, function () {
            const win = gui.Window.get();
            global.me_editMode = false;
            win.reload();
        });
    }
}));
editMenu.append(new gui.MenuItem({
    label: 'Discard Edits',
    key: '3',//not working...
    modifiers: "ctrl",
    click: function () {
        const win = gui.Window.get();
        global.me_editMode = false;
        win.reload();
    }
}));

const exportMenu = new gui.Menu();
menu.append(new gui.MenuItem({
    label: 'Export',
    submenu: exportMenu
}));
exportMenu.append(new gui.MenuItem({
    label: 'Flatten',
    key: '4',//not working...
    modifiers: "ctrl",
    click: function () {
        //TODO
    }
}));

gui.Window.get().menu = menu;