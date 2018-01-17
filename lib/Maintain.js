"use strict";
//region npm modules
const path = require('path');
const fs = require('fs-extra');
//endregion
//region modules
const HtmlManipulation = require("./HtmlManipulation").HtmlManipulation;
const Filer = require("./Filer").Filer;
//endregion

/**
 @class Maintain
 */
const Maintain = function () {
    const _self = this;

    //region private fields and methods
    let _htmlManipulation;
    let _filer;
    const _init = function () {
        _htmlManipulation = new HtmlManipulation();
        _filer = new Filer();
    };

    //endregion

    this.makeDirs = function (parent, dirs) {
        dirs.forEach(function (dir, i) {
            const dirPath = path.join(parent, dir);
            if (!fs.existsSync(dirPath)) {
                console.log(`Making dir ${dirPath}`);
                fs.mkdirSync(dirPath);
            }
        });
    };

    //region public API
    this.initDir = function (dir) {
        this.makeDirs(dir, ['original', 'edit', 'deploy']);

        let indexJs = path.join(dir, 'index.js');
        if (!fs.existsSync(indexJs)) {
            fs.copySync(path.join(__dirname, '../resources/index.js'), indexJs);
        }
        fs.copySync(path.join(__dirname, '../resources/editor-scripts'), path.join(dir, 'edit', 'editor-scripts'));
    };

    this.prepareEditorEnvironment = function (dir, callback) {
        let editDir = path.join(dir, 'edit');
        fs.copySync(path.join(dir, 'original'), editDir, {overwrite: false});
        _filer.getFilesDeep(editDir, function (err, fileNames) {
            if (err) throw  err;
            fileNames.forEach(function (fileName, i) {
                if (path.extname(fileName) === '.html') {
                    _htmlManipulation.insertEditorScriptElements(fileName);
                }
            });
            callback();
        });
    };

    this.deployHtmlFiles = function (dir, callback) {
        let editDir = path.join(dir, 'edit');
        let deployDir = path.join(dir, 'deploy');
        fs.copySync(path.join(dir, 'original'), deployDir, {overwrite: false});
        _filer.getFilesDeep(editDir, function (err, fileNames) {
            if (err) throw  err;
            fileNames.forEach(function (fileName, i) {
                if (path.extname(fileName) === '.html') {
                    const html = _htmlManipulation.flattenEditables(fileName);

                    const relPath = path.relative(path.join(process.cwd(), editDir), fileName);
                    //TODO support non-top-level HTML files
                    fs.writeFileSync(path.join(deployDir, relPath), html)
                }
            });
            callback();
        })
    };
    //endregion

    _init();
};

module.exports.Maintain = Maintain;