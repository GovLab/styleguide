var browserSync     = require('browser-sync'),
gulp            = require('gulp'),
sass            = require('gulp-sass'),
shell           = require('gulp-shell'),
packagejson     = require('./package.json'),
file            = require('gulp-file'),
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

gulp.task('assets', function() {
  return gulp.src('img/**/*')
  .pipe(plumber())
  .pipe(gulp.dest('guide/img'))
  .pipe(browserSync.stream())
});

gulp.task('ver', function() {
  return gulp.src('')
  .pipe(plumber())
  .pipe(file('styleguide.md', packagejson.name + ' - ' + packagejson.version))
  .pipe(gulp.dest('sass/'))
});

gulp.task('kss', shell.task([
  './node_modules/.bin/kss-node --config kss-config.json'
  ])
);

gulp.task('pushver', shell.task([
  'git add guide/index.html sass/styleguide.md',
  'git commit -m "gulp auto commit (pushver)"',
  'git push'
  ])
);

gulp.task('deploy', ['ver', 'sass', 'js', 'kss', 'assets', 'pushver'], shell.task([
  'git subtree push --prefix guide origin gh-pages'
  ])
);

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('default', ['browserSync', 'ver', 'sass', 'js', 'kss', 'assets'], function (){
  gulp.watch(['sass/**/*.scss', 'sass/*.md', 'kss-template/*', 'js/*'], ['sass', 'js', 'kss']);
  gulp.watch('kss-template/*').on('change', browserSync.reload);
  gulp.watch('js/*').on('change', browserSync.reload);
  gulp.watch('img/*', ['assets', 'reload']);
});