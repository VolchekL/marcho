import { src, dest, watch, parallel, series } from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
const sass = gulpSass(dartSass);
import concat from 'gulp-concat';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browserSyncModule from 'browser-sync';
const browserSync = browserSyncModule.create();
import { deleteAsync } from 'del';

export function cleanDist() {
    return deleteAsync('dist');
}

export function styles() {
    return src('app/scss/style.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(postcss([autoprefixer({
            overrideBrowserslist: ['last 10 versions']
        })]))
        .pipe(concat('style.min.css'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

export function build() {
    return src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/images/dest/**/*'
    ], {base: 'app'})
        .pipe(dest('dist'));
}

export function serve() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
}

export function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/*.html']).on('change', browserSync.reload);
}

export default series(cleanDist, styles, build, parallel(serve, watching));