'use strict';

var gulp = require( 'gulp' );

// JS
var uglify = require( 'gulp-uglify' );

// CSS
var sass         = require( 'gulp-ruby-sass' );
var autoprefixer = require( 'gulp-autoprefixer' );
var minifyCSS    = require( 'gulp-minify-css' );
var cssnano      = require( 'gulp-cssnano' );

// UTIL
var concat     = require( 'gulp-concat' );
var rename     = require( 'gulp-rename' );
var sourcemaps = require( 'gulp-sourcemaps' );
var plumber    = require( 'gulp-plumber' );

var jade = require( 'gulp-jade' );

var paths = {
    src : {
        jade  : './src/jade',
        js    : './src/js',
        sass  : './src/scss',
        vendor: './src/vendor'
    },
    dist: {
        jade: './dist',
        js  : './dist/js',
        css : './dist/css'
    }
};

//////////////////////////////////////////////////
// JS Tasks
//////////////////////////////////////////////////

gulp.task( 'js:vendor', [], function () {
    return gulp.src( [
                   './node_modules/jquery/dist/jquery.min.js',
                   './node_modules/bootstrap/dist/js/bootstrap.min.js'
               ] )
               .pipe( sourcemaps.init() )
               .pipe( plumber() )
               .pipe( concat( 'vendor.min.js' ) )
               .pipe( plumber.stop() )
               .pipe( gulp.dest( paths.dist.js ) );
} );

gulp.task( 'js:app', [], function () {
    return gulp.src( [
                   paths.src.js + '/**/*.js'
               ] )
               .pipe( sourcemaps.init() )
               .pipe( plumber() )
               .pipe( concat( 'app.js' ) )
               .pipe( gulp.dest( paths.dist.js ) )
               .pipe( rename( 'app.min.js' ) )
               .pipe( uglify() )
               .pipe( sourcemaps.write( '.' ) )
               .pipe( plumber.stop() )
               .pipe( gulp.dest( paths.dist.js ) );
} );

//////////////////////////////////////////////////
// CSS Tasks http://alexwenzel.de/2014/69/gulp-concat-compile-compress
//////////////////////////////////////////////////

gulp.task( 'css:vendor', [], function () {
    return gulp.src( [
                   "./node_modules/bootstrap/dist/css/bootstrap.min.css"
               ] )
               .pipe( plumber() )
               .pipe( sourcemaps.init() )
               .pipe( concat( 'vendor.css' ) )
               .pipe( minifyCSS() )
               .pipe( rename( { suffix: ".min" } ) )
               .pipe( sourcemaps.write() )
               .pipe( plumber.stop() )
               .pipe( gulp.dest( paths.dist.css ) );
} );

gulp.task( 'css:app', [], function () {
    return sass( [
        paths.src.sass + '/app.scss'
    ] )
    .pipe( autoprefixer( 'last 2 version' ) )
    .pipe( gulp.dest( paths.dist.css ) )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( cssnano() )
    .pipe( gulp.dest( paths.dist.css ) );
} );

//////////////////////////////////////////////////
// JADE
//////////////////////////////////////////////////

gulp.task( 'jade', function () {
    var YOUR_LOCALS = {};

    gulp.src( paths.src.jade + '/*.jade' )
        .pipe( plumber() )
        .pipe( jade( {
            locals: YOUR_LOCALS,
            pretty: true
        } ) )
        .pipe( plumber.stop() )
        .pipe( gulp.dest( paths.dist.jade ) );
} );

//////////////////////////////////////////////////
// BUILD Tasks
//////////////////////////////////////////////////

gulp.task( 'vendor', [ 'js:vendor', 'css:vendor' ] );
gulp.task( 'app', [ 'js:app', 'css:app', 'jade' ] );

//////////////////////////////////////////////////
// WATCH Tasks
//////////////////////////////////////////////////

gulp.task( 'default', function () {
    gulp.watch( paths.src.jade + '/**/*.jade', [ 'jade' ] );
    gulp.watch( paths.src.js + '/**/*.js', [ 'js:app' ] );
    gulp.watch( paths.src.sass + '/**/*.scss', [ 'css:app' ] );
} );