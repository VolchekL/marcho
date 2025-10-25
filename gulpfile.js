// import { src, dest, watch, parallel, series } from 'gulp';
// import gulpSass from 'gulp-sass';
// import * as dartSass from 'sass';
// const sass = gulpSass(dartSass);
// import concat from 'gulp-concat';
// import postcss from 'gulp-postcss';
// import autoprefixer from 'autoprefixer';
// import browserSyncModule from 'browser-sync';
// const browserSync = browserSyncModule.create();
// import { deleteAsync } from 'del';

// export function cleanDist() {
//     return deleteAsync('dist');
// }

// export function styles() {
//     return src('app/scss/style.scss')
//         .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
//         .pipe(postcss([autoprefixer({
//             overrideBrowserslist: ['last 10 versions']
//         })]))
//         .pipe(concat('style.min.css'))
//         .pipe(dest('app/css'))
//         .pipe(browserSync.stream());
// }

// export function build() {
//     return src([
//         'app/**/*.html',
//         'app/css/style.min.css',
//         'app/js/main.min.js',
//         'app/images/dest/**/*'
//     ], {base: 'app'})
//         .pipe(dest('dist'));
// }

// export function serve() {
//     browserSync.init({
//         server: {
//             baseDir: 'app'
//         },
//         notify: false
//     });
// }

// export function watching() {
//     watch(['app/scss/**/*.scss'], styles);
//     watch(['app/*.html']).on('change', browserSync.reload);
// }

// export default series(cleanDist, styles, build, parallel(serve, watching));

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
import imagemin from 'gulp-imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
import gulpIf from 'gulp-if';
import fs from 'fs';

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

export function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/slick-carousel/slick/slick.min.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

export function images() {
    const srcExists = fs.existsSync('app/images/src');
    return src(srcExists ? 'app/images/src/**/*' : [])
        .pipe(gulpIf(srcExists, imagemin([
            imageminGifsicle(),
            imageminJpegtran(),
            imageminOptipng(),
            imageminSvgo()
        ])))
        .pipe(dest('app/images/dest'));
}

export function build() {
    const destExists = fs.existsSync('app/images/dest');
    return src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js',
        ...destExists ? ['app/images/dest/**/*'] : []
    ], { base: 'app' })
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
    watch(['app/js/main.js'], scripts);
    watch(['app/images/src/**/*'], images);
}

export default series(cleanDist, images, styles, scripts, build, parallel(serve, watching));