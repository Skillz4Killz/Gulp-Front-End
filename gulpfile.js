"use strict";
const gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	maps = require('gulp-sourcemaps'),
	imagemin = require('gulp-imagemin'),
	del = require('del'),
	browserSync = require('browser-sync').create();

gulp.task('clean', function() {
	return del(['dist']);
})

gulp.task('scripts', ['clean'], function() {
	return gulp.src(['js/global.js', 'js/circle/circle.js', 'js/circle/autogrow.js'])
	.pipe(maps.init())
	.pipe(concat('all.min.js'))
	.pipe(uglify())
	.pipe(rename('all.min.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', ['clean'], function() {
	return gulp.src('sass/global.scss')
	.pipe(maps.init())
	.pipe(sass())
	.pipe(rename('all.min.css'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('dist/styles'))
	.pipe(browserSync.stream());
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

gulp.task('build', ['clean', 'scripts', 'styles', 'images'], function() {
	return gulp.src(['/scripts', '/styles', 'index.html', 'images/**', 'icons/**'], {base: './'})
		.pipe(gulp.dest('dist'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['build'], function() {

    browserSync.init({
        server: "dist"
    });

    gulp.watch("sass/*", ['build']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve'], function() {
});