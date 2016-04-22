var gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  babel = require('gulp-babel'),
  Cache = require('gulp-file-cache');

var cache = new Cache();

gulp.task('js', function () {
  return gulp.src('./src/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(cache.filter())
    .pipe(babel({
      presets: ['stage-0', 'es2015'],
      plugins: ['transform-runtime']
    }))
    .pipe(cache.cache())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('develop', ['js'], function () {
  nodemon({
    script: 'dist/app.js',
    watch: ['.'],
    ext: 'js yaml',
    ignore: ['node_modules/', 'static/', 'dist/'],
    tasks: ['js'],
  });
});

gulp.task('default', ['develop']);
