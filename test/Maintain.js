const path = require("path");
const fs = require("fs-extra");
exports.initDir = function (test) {
    test.expect(1);
    let testBedDir = path.join(__dirname, 'testbed');
    fs.emptyDir(testBedDir)
        .then(() => {
            process.chdir(testBedDir);
            const nwme = require('../lib/nwme');
            nwme.init();
            const testPath = path.join('./', 'edit', 'editor-scripts', 'editor.js');
            test.ok(fs.existsSync(testPath), "editor script exists");
            test.done();
        })
        .catch(err => {
            test.ok(false, err);
            test.done();
        });

};
exports.prepareEditorEnvironment = function (test) {
    test.expect(2);
    let testBedDir = path.join(__dirname, 'testbed');
    //first emulate the user action of copying the raw html files and assets into 'original'
    fs.copySync(path.join(__dirname, 'resources'), path.join(testBedDir, 'original'));

    process.chdir(testBedDir);
    const nwme = require('../lib/nwme');
    nwme.prepareEditor(function () {
        let mock1Path = path.join(testBedDir, './edit/mock1.html');
        test.ok(fs.existsSync(mock1Path), `${mock1Path} exists`);

        const mockContents = fs.readFileSync('./edit/mock1.html').toString();
        test.ok(mockContents.indexOf('data-temporary') > 0, "data-temporary tag was added");
        test.done();//??? doesn't complete... https://stackoverflow.com/questions/18055942/why-nodejs-test-case-with-nodeunit-keep-loading-in-webstorm-after-successfully-p/20290694
        console.log('prepareEditorEnvironment DONE');
    });
};