//region npm modules
const fs = require("fs");
const path = require("path");
const cheerio = require('cheerio');
//endregion
//region modules

//endregion

/**
 @class HtmlManipulation
 */
const HtmlManipulation = function () {
    const _self = this;

    //region private fields and methods
    const _init = function () {
    };

    const _cheerioFromFile = function (filePath) {
        const targetContents = fs.readFileSync(filePath).toString();
        return cheerio.load(targetContents);
    };

    const _mergeHtml = function (targetFile, sourceFile, filePath) {
        const $1 =_cheerioFromFile(targetFile);
        const $2 =_cheerioFromFile(sourceFile);

        $2('head').contents().each(function (a, node) {
            if (node.type === 'script') {
                // $2(this).attr('data-temporary', true);
            }
            $1('head').append(node);
        });

        $2('body').contents().each(function (a, node) {
            if (node.type === 'script') {
                // $2(this).attr('data-temporary', true);
            }
            $1('body').append(node);
        });

        fs.writeFileSync(filePath, $1.html());
    };

    const _restoreContent = function (obj, $editable) {
        $editable.html(_.get(obj, $editable.attr('data-editable')));
    };

    const _restoreFromData = function ($, data) {
        $('[data-editable]').each(function () {
            _restoreContent(data, $(this));
        });

    };
    //endregion

    //region public API
    this.insertEditorScriptElements = function (htmlFile) {
        _mergeHtml(htmlFile, path.join(__dirname, '../resources/editor-scripts.html'), htmlFile);
    };

    this.saveHtmlFile= function (filePath, data, callback) {
        const $ =_cheerioFromFile(filePath);
        _restoreFromData($, data);
        fs.writeFileSync(filePath, $.html());
    };
    //endregion

    _init();
};

module.exports.HtmlManipulation = HtmlManipulation;

