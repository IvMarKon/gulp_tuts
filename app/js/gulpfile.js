var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs')
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del');

gulp.task('mytask', function () {
    console.log("Hello new task");
});

gulp.task('sass', function () {
    return gulp.src('../sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('../css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: '../../'
        },
        notify: false
    });
});

gulp.task('scripts', function () {
    return gulp.src([
            '../../node_modules/jquery/dist/jquery.min.js',
            '../../node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
            './main.js'
        ]).pipe(concat('libs.min.js'))
        .pipe(uglify({
            inSourceMap: true
        }))
        .pipe(gulp.dest('../../dist/js'));
});

gulp.task('styles', function () {
    return gulp.src('../css/*.css')
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('../../dist/css'));
});

gulp.task('clean', function() {
    return del.sync('../../dist',{force: true}); // Удаляем папку dist перед сборкой
});

gulp.task('watch', ['browser-sync', 'sass', 'scripts', 'styles','clean'], function () {
    gulp.watch('../sass/**/*.+(sass|scss)', ['sass', 'styles']);
    gulp.watch('../../*.html', browserSync.reload);
    gulp.watch('./*.js', ['scripts']);
});