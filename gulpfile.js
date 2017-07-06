"use strict";
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const del = require('del');

gulp.task('clean', function() {
	return del(['dist']);
})

gulp.task('concatScripts', ['clean'], function() {
	return gulp.src(['js/global.js', 'js/circle/circle.js', 'js/circle/autogrow.js'])
	.pipe(maps.init())
	.pipe(concat('all.min.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('dist/scripts'));

});

gulp.task('scripts', ['concatScripts'], function() {
	return gulp.src('dist/scripts/global.js')
	.pipe(uglify())
	.pipe(rename('all.min.js'))
	.pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', ['clean'], function() {
	return gulp.src('sass/global.scss')
	.pipe(maps.init())
	.pipe(sass())
	.pipe(rename('all.min.css'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('dist/styles'))
});

gulp.task('images', ['clean'], function() {
	return gulp.src(['images/**', 'icons/**'])
		.pipe(imagemin([
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 5}),
		    imagemin.svgo({plugins: [{removeViewBox: true}]})
		]))
		.pipe(gulp.dest('dist/content'))
});

gulp.task('watchFiles', function() {
	gulp.watch('sass/**', ['styles']);
	gulp.watch('js/**', ['concatScripts'])
});

gulp.task('build', ['clean', 'scripts', 'styles', 'images'], function() {
	return gulp.src(['/scripts', '/styles', 'index.html', 'images/**', 'icons/**'], {base: './'})
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles']);

gulp.task('default', ['serve'], function() {
	gulp.start('build');
});