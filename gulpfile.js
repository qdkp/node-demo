var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var path = require('path');
var minify_css = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['watch', 'server']);

/**
 * 监控javascripts/*和less/*.less文件
 */
gulp.task('watch', ['uglify', 'less', 'images'], function() {
  gulp.watch('assets/javascripts/**/*.js', ['uglify']);
  gulp.watch('assets/less/**/*.less', ['less']);
  gulp.watch('assets/img/**/*.*', ['images']);
});

/**
 * 编译less文件
 */
gulp.task('less', function() {
  return gulp.src('./assets/less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    // .pipe(minify_css())
    .pipe(gulp.dest('./public/css'));
});

/**
 * 压缩javascripts文件
 */
gulp.task('uglify', function() {
  return gulp.src('./assets/javascripts/**/*.js')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('images', function() {
  return gulp.src('./assets/img/**/*.+(jp?(e)g|gif|png)')
    .pipe(gulp.dest('./public/img/'));
})

/**
 * 运行服务器程序， 进行调试
 */
gulp.task('server', function() {
  nodemon({
    script: 'app.js',
    ext: 'js less',
    env: { 'NODE_ENV': 'development' },
    ignore: [
      '.git',
      'node_modules/**/node_modules',
      'javascripts',
      'public',
      'less'
    ],
    verbose: true,
    watch: [
      'lib',
      'routes',
      'app.js'
    ]
  });
});
