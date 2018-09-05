const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglifyes');
const pump = require('pump');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');

// Copy All HTML files
gulp.task('copyHtml', function(){
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// Minify JS
gulp.task('minifyJS', function(){
    gulp.src('src/scripts/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
  });

  // Compile Sass
gulp.task('sass', function(){
    gulp.src('src/scss/**/*.scss')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
  });
  
  // Optimize Images
gulp.task('imageMin', () =>{
	gulp.src('src/assets/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/assets'))
});

  
  //MOVE BOOTSTRAP STYLE
  gulp.task('sassbootstrap', () => {
    return gulp.src([
      'node_modules/bootstrap/scss/bootstrap.scss'
    ])
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('dist/libs/bootstrap/css'))
    .pipe(browserSync.stream());
  });
  //MOVE BOOSTRAP JS
  gulp.task('jsbootstrap', () => {
    return gulp.src([
      'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
    .pipe(gulp.dest('dist/libs/bootstrap/js'))
    .pipe(browserSync.stream());
  });

  //Move JS libs
  gulp.task('jslibs', () => {
    return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/popper.js/dist/umd/popper.min.js'
    ])
    .pipe(gulp.dest('dist/libs'));
  });

  //move fonts and icons
  gulp.task('font-awesome', () => {
    return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('dist/css'));
  });
  
  gulp.task('fonts', () => {
    return gulp.src('node_modules/font-awesome/fonts/*')
      .pipe(gulp.dest('dist/fonts'));
  });



// Static Server + watching scss/html files
gulp.task('serve', ['copyHtml', 'sass', 'minifyJS', 'imageMin'], function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch('src/scripts/**/*.js', ['minifyJS']).on('change', browserSync.reload);
    gulp.watch('src/assets/**/*', ['imageMin']);
    gulp.watch("src/scss/**/*.scss", ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch('src/*.html', ['copyHtml']);
});


gulp.task('default', ['serve', 'font-awesome', 'fonts', 'jslibs', 'jsbootstrap', 'sassbootstrap']);

/*gulp.task('watch', function(){
  gulp.watch('src/scripts/*.js', ['minifyJS']);
  gulp.watch('src/assets/images/*', ['imageMin']);
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('src/*.html', ['copyHtml']);
});*/