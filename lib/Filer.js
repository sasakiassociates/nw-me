//region npm modules
const fs = require("fs");
const path = require("path");
//endregion
//region modules

//endregion

/**
 @class Filer
 */
const Filer = function () {
    const _self = this;

    //region private fields and methods
    const _init = function () {
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

    //region public API
    this.getFilesDeep = function (dir, callback) {
        _getFilesDeep(dir, callback);
    };
    //endregion

    _init();
};

module.exports.Filer = Filer;

