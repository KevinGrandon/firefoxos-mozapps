var gulp = require('gulp');
var to5 = require('gulp-6to5');
var rename = require('gulp-rename');

gulp.task('to5-dist-modules', function () {
	var files = ['./fxos_apps.js'];
	return gulp.src(files)
		.pipe(to5({
			modules: 'amd'
		}))
		.pipe(rename('build.amd.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('to5-dist-window', function () {
	var files = ['./fxos_apps.js'];
	return gulp.src(files)
		.pipe(to5())
		.pipe(rename('build.standard.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['to5-dist-modules', 'to5-dist-window'], function () {
	console.log('all done.');
});
