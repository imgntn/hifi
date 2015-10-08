var gulp = require('gulp');
var insert = require('gulp-insert');
var deleteLines = require('gulp-delete-lines');
var fs = require('fs');

//we store our globals in an easy to access file.  join them together to make a string.
var jsLintGlobals = require('./jsLintGlobals');
var linterGlobals = [jsLintGlobals.hifi_API, jsLintGlobals.hifi_utilites];
var linterGlobalString = "/*global " + linterGlobals.join(",") + "*/" + '\n';

//gulp task to delete and then add globals
gulp.task('updateLinterGlobals', function() {
    gulp.src('../examples/**/*.js')
        //regex that matches /*global and deletes
        .pipe(deleteLines({
            'filters': [
                /\/{1}\*{1}(global)/
            ]
        }))
        //add the global
        .pipe(insert.prepend(linterGlobalString))
        //send it to the destination
        .pipe(gulp.dest('../examples'));
});

//for the future, we will compose a header file from the file name, license, author, copyright, etc
var jsLicense = require('./jsLicense');
var jsAuthorCopyright = require('./jsLicense');

gulp.task('addFilePath', function() {
    console.log('adding file path ');
    gulp.src('../examples/**/*.js')
        .pipe(insert.transform(function(contents, file) {
            var filename = '// local file: ' + file.path + '\n';
            return filename + liccontents;
        }))
        .pipe(gulp.dest('../examples'));
});

gulp.task('addLicense', function() {
    console.log('adding license');
    gulp.src('../examples/**/*.js')
        .pipe(insert.transform(function(contents, file) {
            var license = jsLicense.apache2 + '\n';
            return license + contents;
        }))
        .pipe(gulp.dest('../examples'));
});

gulp.task('addAuthorCopyright', function() {
    console.log('adding author and copyright');
    gulp.src('../examples/**/*.js')
        .pipe(insert.transform(function(contents, file) {
            var author = jsAuthorCopyright.author + '\n';
            var copyright = jsAuthorCopyright.copyRight + '\n';
            return author + copyright + contents;
        }))
        .pipe(gulp.dest('../examples'));
});

//we will use the header template plus some object templates to create easy to use templates for users to start from
gulp.task('createEntityTemplate', function() {
    fs.writeFileSync('templates/entityScript.js', headerTemplate + entityTemplate);
})

gulp.task('createACTemplate', function() {
    fs.writeFileSync('templates/ACScript.js', headerTemplate + ACTemplate);
})
gulp.task('createClientTemplate', function() {
    fs.writeFileSync('templates/clientScript.js', headerTemplate + clientTemplate);
})