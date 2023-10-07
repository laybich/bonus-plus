const xhr = require("xhr")
// Gulp
const {src, dest, series} = require('gulp');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const del = require('del');
const fs = require('fs');
const parser = require('gulp-xml2json');
// Html
const htmlmin = require('gulp-htmlmin');
// Css
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const uncss = require('postcss-uncss');
// Js
const typescript = require('gulp-typescript');
const terser = require('gulp-terser');
const mustache = require('gulp-mustache');

const DIST = 'dist';

function mustacheCompile() {
	return src('src/products/prodct.mustache')
		.pipe(mustache('src/products/data/prodct1.json', {
			extension: '.html'
		}))
		.pipe(dest(DIST+'/products/'));
}

function html() {
	return src(['src/index.html', 'src/**/*.html'])
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(dest(DIST));
}

function css() {
	return src('src/css/*.css')
		.pipe(postcss([
			autoprefixer(),
			cssnano()
		]))
		.pipe(rename({extname: '.min.css'}))
		.pipe(dest(DIST+'/css/'));
}

const tsProject = typescript.createProject('tsconfig.json');

function ts() {
	return src('src/js/*.ts')
		.pipe(tsProject())
		.pipe(terser())
		.pipe(rename({extname: '.min.js'}))
		.pipe(dest(DIST+'/js/'));
}

function js() {
	return src('src/js/*.js')
		.pipe(terser())
		.pipe(rename({extname: '.min.js'}))
		.pipe(dest(DIST+'/js/'));
}

function img() {
	return src('src/**/img/**/*.*')
		.pipe(dest(DIST));
}

function xml() {
	return src('src/*.xml')
		.pipe(dest(DIST));
}

function clear() {
	return del(DIST, {force: true});
}

exports.build = series(clear, ts, js, css, html, img, xml);
exports.mustache = mustacheCompile;
exports.clear = clear;