'use strict';

var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('lint', function () {
    gulp.src(['./src/js/*.js'])
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('jshint-stylish'));

    // gulp.src(['./src/css/*.css'])
    //     .pipe(plugins.csslint('.csslintrc'))
    //     .pipe(plugins.csslint.reporter());
});

/**
 * build Tasks
 */
gulp.task('build', ['lint'], function () {
    var files = [
        'dist/css/*.css',
        'dist/js/*.js',
        'dist/img/*.{gif,png,jpg}'
    ];

    // cleanup previous builds
    gulp.src(files, {read: false})
        .pipe(plugins.clean());

    var dists = {
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
    };

    // build js
    gulp.src(['src/js/*.js'])
        .pipe(plugins.concat('chosen.js'))
        .pipe(plugins.removeUseStrict())
        .pipe(gulp.dest(dists.js))
        .pipe(plugins.rename({ suffix: '.min'}))
        .pipe(plugins.uglify({ outSourceMap: true, mangle: true, report: 'gzip' }))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest(dists.js));

    // build css
    gulp.src(['src/css/*.css'])
        .pipe(plugins.concat('chosen.css'))
        .pipe(gulp.dest(dists.css))
        .pipe(plugins.rename({ suffix: '.min'}))
        .pipe(plugins.minifyCss())
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest(dists.css));

    gulp.src(['src/img/*.{gif,png,jpg}'])
        .pipe(gulp.dest(dists.img));

    // bump bower, npm versions
    gulp.src(['package.json', 'bower.json'])
        .pipe(plugins.bump())
        .pipe(gulp.dest('.'));

});

