const gulp = require('gulp')
const minifycss = require('gulp-minify-css')
const htmlmin = require('gulp-htmlmin')
const htmlclean = require('gulp-htmlclean')

const uglify = require('gulp-uglify-es').default

const minifyHtml = () => gulp.src('./docs/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin({
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
    }))
    .pipe(gulp.dest('./docs'));

const minifyCss = () => gulp.src('./docs/**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('./docs'));

const minifyJs = () => gulp.src('./docs/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./docs'));

exports.default = gulp.series(gulp.parallel(minifyHtml, minifyCss, minifyJs))
