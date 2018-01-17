const Maintain = require('./Maintain').Maintain;
const HtmlManipulation = require('./HtmlManipulation').HtmlManipulation;

module.exports = {
    init: function () {
        new Maintain().initDir('./');
    },
    prepareEditor: function (callback) {
        new Maintain().prepareEditorEnvironment('./', callback);
    },
    saveHtmlFile: function (filePath, data, callback) {
        new HtmlManipulation().saveHtmlFile(filePath, data, callback);
    },
    deployHtmlFiles: function (dir, callback) {
        new Maintain().deployHtmlFiles(dir, callback);
    },
    run: function (callback) {
        //how do we load the right HTML in the editor folder (or do we manually specify in package.json)?
    }
};