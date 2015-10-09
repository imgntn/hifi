var gulp = require('gulp');

var gulp = require('gulp'),
    eslint = require('gulp-eslint');

var jsLintGlobals = require('./jsLintGlobals');

var API_GLOBALS = jsLintGlobals.hifi_API.split(",");
var UTILITY_GLOBALS = jsLintGlobals.hifi_utilities.split(",");

var linterOptions = {
    globals: {},
};

UTILITY_GLOBALS.forEach(function(key) {
    linterOptions.globals[key] = false;
})

API_GLOBALS.forEach(function(key) {
    linterOptions.globals[key] = false;
});

console.log('linterOptions.globals', linterOptions.globals)

gulp.task('watch', function() {
    gulp.watch('../examples/**/*.js')
    .on('change', function(file) {
        console.log('JS changed' + ' (' + file.path + ')');
    });
});

gulp.task('lint', function() {
    return gulp.src(['../examples/**/*.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint(linterOptions))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint'], function() {
    // This will only run if the lint task is successful...
});