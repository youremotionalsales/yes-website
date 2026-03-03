const { src, dest, series } = require('gulp');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const minify = require('gulp-minify');
const uglify = require('gulp-uglify');
const strip = require('gulp-strip-comments');
const htmlmin = require('gulp-htmlmin');

const bundleCss = () =>
	src([
		'node_modules/@fortawesome/fontawesome-free/css/all.css',
		'node_modules/bootstrap/dist/css/bootstrap.css',
		'src/**/*.css'
	])
	.pipe(concat('main.css'))
	.pipe(csso())
	.pipe(dest('dist/css'));

exports.bundleCss = bundleCss

const bundleVendorsJs = () =>
	src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/bootstrap/dist/js/bootstrap.js',
	])
	.pipe(strip())
	.pipe(concat('vendors.js'))
	.pipe(uglify({
		output: {
			comments: false,
		}
	}))
	.pipe(dest('dist/js'));

exports.bundleVendorsJs = bundleVendorsJs

const bundleJs = () =>
	src(['src/**/*.js'])
	.pipe(strip())
	.pipe(concat('main.js'))
	.pipe(uglify({
		output: {
			comments: false,
		}
	}))
	.pipe(dest('dist/js'));

exports.bundleJs = bundleJs

const bundleWebfonts = () =>
	src('node_modules/@fortawesome/fontawesome-free/webfonts/**')
	.pipe(dest('dist/webfonts/'));

exports.bundleWebfonts = bundleWebfonts

const bundleHtml = () =>
	src(['src/**/*.html'])
	.pipe(htmlmin({
		collapseWhitespace: true,
		removeComments: true,
		minifyCSS: true,
		minifyJS: true
    }))
    .pipe(dest('dist/'));

exports.bundleHtml = bundleHtml

const bundleFavicon = () =>
	src('src/favicon.ico')
    .pipe(dest('dist/'));

exports.bundleHtml = bundleHtml

exports.default = series(bundleCss, bundleVendorsJs, bundleJs, bundleWebfonts, bundleHtml, bundleFavicon);
