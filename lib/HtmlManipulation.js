"use strict";
//region npm modules
const _ = require('lodash');
const fs = require("fs");
const path = require("path");
const cheerio = require('cheerio');
//endregion
//region modules
const Filer = require("./Filer").Filer;
//endregion

/**
 @class HtmlManipulation
 */
const HtmlManipulation = function () {
    const _self = this;

    //region private fields and methods
    let _filer;
    const _init = function () {
        _filer = new Filer();
    };

    const _cheerioFromFile = function (filePath) {
        const targetContents = fs.readFileSync(filePath).toString();
        return cheerio.load(targetContents);
    };

    const _mergeHtml = function ($1, $2, filePath) {
        const existingScripts = [];
        $1('head').contents().each(function (a, node) {
            if (node.type === 'script') {
                existingScripts.push($1(this).attr('src'));
            }
        });
        $2('head').contents().each(function (a, node) {
            let ignore = false;
            if (node.type === 'script') {
                const dedoop = $2(this).attr('data-dedoop');
                if (dedoop) {
                    existingScripts.forEach(function (src, i) {
                        const scriptFile = path.basename(src);
                        if (scriptFile.startsWith(dedoop)) {
                            ignore = true;
                        }
                    });
                }
            }
            if (!ignore) {
                $1('head').append(node);
            }
        });

        $2('body').contents().each(function (a, node) {
            if (node.type === 'script') {
                // $2(this).attr('data-temporary', true);
            }
            $1('body').append(node);
        });

        _saveHtml(filePath, $1);
    };

    const _saveHtml = function (filePath, $) {
        fs.writeFileSync(filePath, _stripEmptyLines($.html()));
    };

    const _flattenEditables = function (htmlFile) {
        const $ = _cheerioFromFile(htmlFile);

        _removeDataAttributes($, ['data-duplicatable', 'data-editable']);
        _removeTemporaryElements($);

        return _stripEmptyLines($.html());
    };

    const _restoreContent = function (obj, $editable) {
        $editable.html(_.get(obj, $editable.attr('data-editable')));
    };

    const _restoreFromData = function ($, data) {
        $('[data-editable]').each(function () {
            _restoreContent(data, $(this));
        });
        };

    const _removeDataAttributes = function ($, attributes) {
        attributes.forEach(function (attribute, i) {
            $('[' + attribute + ']').each(function () {
                $(this).removeAttr(attribute);
            });
        });

    };

    const _removeTemporaryElements = function ($) {
        $('[data-temporary]').each(function () {
            $(this).remove();
        });
    };

    const _stripEmptyLines = function (input) {
        return input.replace(/(^[ \t]*\n)/gm, "");
    };

    //endregion

    //region public API
    this.insertEditorScriptElements = function (htmlFile) {
        const $1 = _cheerioFromFile(htmlFile);
        const $2 = _cheerioFromFile(path.join(__dirname, '../resources/editor-scripts.html'));
        _removeTemporaryElements($1);
        _mergeHtml($1, $2, htmlFile);
    };

    this.saveHtmlFile = function (filePath, data, callback) {
        const $ = _cheerioFromFile(filePath);
        _restoreFromData($, data);
        _saveHtml(filePath, $);
        if (callback) callback();
    };

    this.flattenEditables = function (fileName) {
        return _flattenEditables(fileName);
    };
    //endregion

    _init();
};

module.exports.HtmlManipulation = HtmlManipulation;

