const { src, dest, series, parallel, watch} = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");
const imageReduce = require('gulp-image');
function css() {
    return src('./src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(postcss([autoprefixer(),cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(dest('dist/css'))
}
function html() {
    return src('./src/html/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dest('dist/'))
}
function image(){
    return src('./src/assets/images/*')
    .pipe(imageReduce())
    .pipe(dest('dist/images/'))
}
function watchAll(){
    watch('./src/sass/*.scss',css)
    watch('./src/html/*.html',html)
}
exports.css = css;
exports.html = html;
exports.image = image;
exports.watchAll=watchAll;
exports.default = parallel(html, css, image,dev);