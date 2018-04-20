'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs'),
    imagemin = require('gulp-imagemin');

const paths = {
    sass: './assets/sass/**/*.scss',
    js: './assets/js/**/**/*.js',
    images: './assets/images/**/**/*.png'
}

const dest = {
    css: './dist/css/',
    js: './dist/js/',
    images: './dist/images/'
}

gulp.task('sass', function() {
    return gulp.src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('src.css'))
        .pipe(gulp.dest(dest.css));
});

gulp.task('js-concat', function() {
  return gulp.src(paths.js)
    .pipe(concat('src.js'))
//    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('image', () =>
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest(dest.images))
);

gulp.task('watch', function(){
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['js-concat']);
});

gulp.task('default', ['sass','js-concat', 'image', 'watch']);
