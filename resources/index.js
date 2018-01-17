const nwme = require('nw-me');

//*** TO USE THIS DEFAULT S3 SYNC MODULE ***
//* specify AWS_ACCESS_KEY and AWS_SECRET_KEY as environment variables
//* uncomment the lines below (between >>>>> && <<<<<)
//* modify bucket, prefix and URL
//* run "npm install s3-sync"
//* run "npm install readdirp"
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// const s3sync = require('s3-sync');
// const readdirp = require('readdirp');
// const deployToS3 = {
//     deploy: function (folder, type, callback) {
//         const files = readdirp({
//             root: folder
//         });
//         const prefix = 'mydir/' + type + '/';
//         const uploader = s3sync({
//             key: process.env.AWS_ACCESS_KEY, //
//             secret: process.env.AWS_SECRET_KEY,
//             bucket: 'mysite',
//             concurrency: 6,
//             prefix: prefix
//         }).on('data', function (file) {
//             console.log(file.fullPath + ' -> ' + file.url)
//         }).on('end', function () {
//             console.log('DONE');
//             if (callback) callback({
//                 success: true,
//                 url: 'http://mysite.s3-website-us-east-1.amazonaws.com/' + prefix
//             });
//         });
//
//         files.pipe(uploader);
//     }
// };
// nwme.setDeploymentModule(deployToS3);
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
nwme.prepareEditor(function () {
    nw.Window.open('edit/index.html', {}, function (win) {

    });
});