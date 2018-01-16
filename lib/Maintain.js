"use strict";
//region npm modules
const path = require('path');
const fs = require('fs-extra');
//endregion
//region modules
const HtmlManipulation = require("./HtmlManipulation").HtmlManipulation;
//endregion

/**
 @class Maintain
 */
const Maintain = function () {
    const _self = this;

    //region private fields and methods
    let _htmlManipulation;
    const _init = function () {
        _htmlManipulation = new HtmlManipulation();
    };

    const _getFilesDeep = function (dir, callback) {
        const walk = function (dir, done) {
            let results = [];
            fs.readdir(dir, function (err, list) {
                if (err) return done(err);
                let pending = list.length;
                if (!pending) return done(null, results);
                list.forEach(function (file) {
                    file = path.resolve(dir, file);
                    fs.stat(file, function (err, stat) {
                        if (stat && stat.isDirectory()) {
                            walk(file, function (err, res) {
                                results = results.concat(res);
                                if (!--pending) done(null, results);
                            });
                        } else {
                            results.push(file);
                            if (!--pending) done(null, results);
                        }
                    });
                });
            });
        };
        walk(dir, callback);
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
        fs.copySync(path.join(dir, 'original'), editDir);
        _getFilesDeep(editDir, function (err, fileNames) {
            if (err) throw  err;
            fileNames.forEach(function (fileName, i) {
                if (path.extname(fileName) === '.html') {
                    _htmlManipulation.insertEditorScriptElements(fileName);
                }
            });
            callback();
        });
    };
    //endregion

    _init();
};

module.exports.Maintain = Maintain;