var browserSync     = require('browser-sync'),
gulp            = require('gulp'),
sass            = require('gulp-sass'),
shell           = require('gulp-shell'),
plumber         = require('gulp-plumber');

// Browser Sync
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'guide' // This is the DIST folder browsersync will serve
    },
    open: false
  })
})

gulp.task('sass', function() {
  return gulp.src('sass/styles.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(gulp.dest('guide/styles'))
  .pipe(browserSync.stream())
});

gulp.task('js', function() {
  return gulp.src('js/*')
  .pipe(plumber())
  .pipe(gulp.dest('guide/js'))
  .pipe(browserSync.stream())
});

gulp.task('kss', shell.task([
  './node_modules/.bin/kss-node --config kss-config.json'
  ])
);

gulp.task('deploy', shell.task([
  'git subtree push --prefix guide origin gh-pages'
  ])
);

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('default', ['browserSync', 'sass', 'js', 'kss'], function (){
  gulp.watch(['sass/**/*.scss', 'sass/*.md', 'kss-template/*', 'js/*'], ['sass', 'js', 'kss']);  // this could be split up and improved
  gulp.watch('kss-template/*').on('change', browserSync.reload);
  gulp.watch('js/*').on('change', browserSync.reload);
});