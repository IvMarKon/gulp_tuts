'use strict'

var gulp = require('gulp');
var extname = require('gulp-extname');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var gulpIf = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var newer = require('gulp-newer');
var autoprefixer = require('gulp-autoprefixer');
var remember = require('gulp-remember');
var path = require('path');
var cached = require('gulp-cached');
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');// or use multipipe or stream-combiner2

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('default', function () {
    return gulp.src(['src/*.{js,css}', '!node_modules/**'], {
            read: false
        })
        .on('data', function (file) {
            console.log({
                contents: file.contents,
                path: file.path,
                cwd: file.cwd,
                base: file.base,
                relative: file.relative,
                dirname: file.dirname,
                basename: file.basename,
                stem: file.stem,
                extname: file.extname
            })
        }).pipe(extname())
        .pipe(gulp.dest('dest/js'));
});
gulp.task('n_styles',function(){
    return gulp.src('frontend/styles/**/*.css')
    .pipe(cached('n_styles_cached'))
    .pipe(autoprefixer())
    .pipe(remember('n_styles_cache'))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('public'));
});
gulp.task('styles', function () {
    return gulp.src('frontend/styles/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(debug({
            title: 'src'
        }))
        .pipe(sass())
        .on('error',notify.onError(function(err){
            return {
                title: 'Styles',
                message: err.message
            }
        }))
        .pipe(concat('all.css'))
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulp.dest('public'));
});
gulp.task('assets', function () {
    return gulp.src('frontend/img/**', {
            since: gulp.lastRun('assets')
        })
        .pipe(newer('public'))
        .pipe(debug({
            title: 'assets'
        }))
        .pipe(gulp.dest('public'));
});
gulp.task('clean', function () {
    return del('public');
});

gulp.task('watch', function () {
    gulp.watch('frontend/styles/**.*', gulp.series('styles'));
    gulp.watch('frontend/assets/**.*', gulp.series('assets'));
    gulp.watch('frontend/styles/**/*.css',gulp.series('n_styles')).on('unlink',function(filepath){
        remember.forget('n_styles_cache',path.resolve(filepath));
    });
    delete cached.caches.n_styles_cached[path.resolve(filepath)];
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'assets')));

gulp.task('serve', function(){
    browserSync.init({
        server: 'public'
    });
});

gulp.task('dev', gulp.parallel('watch', 'serve'));
