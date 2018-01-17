"use strict";
const Maintain = require('./Maintain').Maintain;

/**
 @class Main
 */
const Main = function () {
    const _self = this;

    //region private fields and methods
    let _maintain;
    let _deploymentModule = false;
    const _init = function () {
        _maintain = new Maintain();
    };
    //endregion

    //region public API
    this.init = function () {
        _maintain.initDir('./');
    };
    this.prepareEditor = function (callback) {
        _maintain.prepareEditorEnvironment('./', callback);
    };
    this.saveHtmlFile = function (filePath, data, callback) {
        _maintain.saveHtmlFile(filePath, data, callback);
    };
    this.deployHtmlFiles = function (dir, type, callback) {
        _maintain.deployHtmlFiles(dir, function (deployDir) {
            if (_deploymentModule) {
                _deploymentModule.deploy(deployDir, type, function (url) {
                    if (callback) callback(url);
                });
            } else {
                if (callback) callback();
            }
        });
    };
    this.setDeploymentModule = function (deploymentModule) {
        if (!deploymentModule.deploy) throw 'Deployment module needs a ".deploy" method: .deploy(deployDir, type, callback).';
        _deploymentModule = deploymentModule;
    };
    //endregion

    _init();
};

module.exports = new Main();