import { src, dest } from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
const sass = gulpSass(dartSass);

export function styles() {
    return src('app/scss/style.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(dest('app/css'))
        .on('data', (file) => console.log('File contents:', file.contents.toString()));
}