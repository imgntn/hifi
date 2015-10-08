var gulp = require('gulp');
var insert = require('gulp-insert');


//a string containing all of our linter globals
var linterGlobals = '*/global HERE BE YE GLOBALS! */'
// create a default task and just log a message
gulp.task('default', function() {
	console.log('GULP DEFAULT!')
	gulp.src('./examples/**/*.js').pipe(insert.prepend(linterGlobals)).pipe(gulp.dest('tempjs'));

});