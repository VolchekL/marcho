import { src, dest, watch, parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
const sass = gulpSass(dartSass);
import concat from 'gulp-concat';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import browserSyncModule from 'browser-sync';
const browserSync = browserSyncModule.create();
import fs from 'fs';
import path from 'path';
import notify from 'gulp-notify'; 
import { series } from 'gulp';
import { deleteAsync } from 'del';

// Плагины для imagemin
import gifsicle from 'imagemin-gifsicle';
import jpegtran from 'imagemin-jpegtran';
import optipng from 'imagemin-optipng';
import svgo from 'imagemin-svgo';

export function testFolder() {
    try {
        console.log('Current working directory:', process.cwd());
        const sourcePath = path.resolve('app/images/src');
        console.log('Source path:', sourcePath);

        if (fs.existsSync(sourcePath)) {
            console.log('Directory exists!');
            const files = fs.readdirSync(sourcePath);
            console.log('Files in directory:', files);
            files.forEach(file => {
                const filePath = path.join(sourcePath, file);
                const stats = fs.statSync(filePath);
                console.log(`- ${file}: ${stats.size} bytes, isFile: ${stats.isFile()}`);
            });
        } else {
            console.error('Directory does NOT exist:', sourcePath);
            console.log('Creating directory...');
            fs.mkdirSync(sourcePath, { recursive: true });
            console.log('Directory created!');
        }
    } catch (error) {
        console.error('Error in testFolder:', error);
    }
}
export function cleanDist() {
    return deleteAsync('dist');
} 

export function build() {
    return src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js',
    ], {base:'app'})
    .pipe(dest('dist'));
}

export default series(cleanDist, build);
