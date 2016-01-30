var browserSync     = require('browser-sync'),
    gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    shell           = require('gulp-shell')

// Browser Sync
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'guide' // This is the DIST folder browsersync will serve
    },
  })
})

// Sass
// Files the sass task can reach.
// Right now it is getting only the first descendant
// of the sass folder. This is to avoid getting foundation junk
// that was generating errors. If you want to get all the files
// in the sass folder replace 'sass/*.scss' by 'sass/**/*.scss'

gulp.task('sass', function() {
  // return gulp.src('sass/*.scss')
  return gulp.src('sass/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('guide/styles'))  // DIST folder for sass - I think this is wrong for kss
    .pipe(browserSync.stream())
});

// Run shell command
gulp.task('kss', shell.task([
  './node_modules/.bin/kss-node --config kss-config.json'  // runs the shell command
  ])
);

gulp.task('reload', function() {
  browserSync.reload();
});


gulp.task('watch', ['browserSync', 'sass', 'kss'], function (){
  gulp.watch(['sass/**/*.scss', 'sass/*.md', 'kss-template/*'], ['sass', 'kss']);  // this could be split up and improved
});