const gulp = require('gulp');
const htmlMin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps')
const image = require('gulp-image');
const del = require('del');
const rev = require('gulp-rev');
const revDel = require('gulp-rev-delete-original')
const gulpSequence = require('gulp-sequence');
const revRewrite = require('gulp-rev-rewrite');

//const setup
const srcDir = './src';
const distDir = './dist';
gulp.task('sass',()=>{
    return gulp.src(`${srcDir}/sass/**/*.scss`)
    .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
    .pipe(gulp.dest(`${distDir}/assets/css`))
})
gulp.task('copy-html', ()=>{
    return gulp.src(`${srcDir}/html/**/*.html`)
    .pipe(htmlMin({collapseWhitespace: true,removeComments:true}))
    .pipe(gulp.dest(`${distDir}`))
})

gulp.task('transpile', ()=>{
    return gulp.src(`${srcDir}/js/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(babel({presets:['env'],minified:true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${distDir}/assets/js`))
})

// Reload all Browsers
gulp.task('bs-reload',() => {
    browserSync.reload();
});
gulp.task('serve',()=>{
    browserSync.init({server: "./dist"});
})
gulp.task('image', () => {
    gulp.src(`${srcDir}/assets/images/*`)
      .pipe(image())
      .pipe(gulp.dest(`${distDir}/assets/images`));
  });
  gulp.task('copy-image', ()=>{
    gulp.src(`${srcDir}/assets/images/*`)
    .pipe(gulp.dest(`${distDir}/assets/images`));
  })
gulp.task('watch', ()=>{
    gulp.watch(`${srcDir}/html/**/*.html`,['copy-html','bs-reload'])
    gulp.watch(`${srcDir}/sass/**/*.scss`,['sass','bs-reload'])
    gulp.watch(`${srcDir}/js/**/*.js`,['transpile','bs-reload'])
    gulp.watch(`${srcDir}/assets/images/*`,['copy-image','bs-reload'])
});

gulp.task('rev', ()=>{
    return gulp.src([`${distDir}/assets/css/**/*.css`,`${distDir}/assets/js/**/*.js`],{base:'dist/assets'})
    .pipe(rev())
    .pipe(revDel())
    .pipe(gulp.dest(`${distDir}/assets/`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`${distDir}/assets/`));
});
gulp.task('burstcache', ['rev'], function() {
    const manifest = gulp.src('dist/assets/rev-manifest.json')
    return gulp.src('dist/*.html')
      .pipe(revRewrite({ manifest }))
      .pipe(gulp.dest('dist'));
  });

gulp.task('clean', ()=>{
    return del([ 'dist' ]);
})
gulp.task('default', ['sass','transpile','copy-html','copy-image','serve','watch']);

gulp.task('build', gulpSequence('clean',['sass','transpile','copy-html','image'],'burstcache'))
gulp.task('testcache',  gulpSequence('clean',['sass','transpile','copy-html'],'burstcache'))