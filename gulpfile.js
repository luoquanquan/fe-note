const gulp = require('gulp')
const path = require('path')
const minifycss = require('gulp-minify-css')
const htmlmin = require('gulp-htmlmin')
const htmlclean = require('gulp-htmlclean')
const imagemin = require('gulp-imagemin')
const rename = require("gulp-rename")
const replace = require('gulp-replace')
const cache = require('gulp-cache')
const cacheSwap = require('cache-swap')
const fs = require('fs')

const uglify = require('gulp-uglify-es').default
const tmpDir = path.resolve(__dirname, './node_modules/.cache')

const minifyHtml = () => gulp.src('./docs/**/*.html')
    .pipe(htmlclean())
    .pipe(replace('http://handle-note-img.niubishanshan.top', '/note-images'))
    .pipe(htmlmin({
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
    }))
    .pipe(gulp.dest('./docs'));

const minifyCss = () => gulp.src('./docs/**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('./docs'));

const minifyJs = () => gulp.src('./docs/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./docs'));

// 缓存目录, 这样就能实现长效缓存了, 不用每次都压缩所有图片
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir)
}

exports.default = gulp.series(gulp.parallel(minifyHtml, minifyCss, minifyJs))
