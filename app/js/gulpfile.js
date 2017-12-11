var gulp = require('gulp'),
    sass = require('gulp-sass');

//To run use gulp mytask
gulp.task('mytask', function () {
    console.log("Hello new task");
});

/*
* gulp.task('mytask', function(){
*   return gulp.src('src-files') //select files for work with plugins
*   .pipe(plugin()) //call gulp plugin for work with files
*   .pipe(gulp.dest('folder')) //put result to folder
* });
*/

gulp.task('sass', function () {
    return gulp.src('../sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('../css'));
});

/*
* *.sass - all files in current dir
* **/
/**.js - (without one /) selects all js files in whole project
 * !header.sass - except file from whole selection
 * *.+(sass|scss) - all scss and sass files from current dir
 * */

