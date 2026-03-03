const { src, dest, series, parallel, watch } = require('gulp');
const fileInclude = require('gulp-file-include');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const concat = require('gulp-concat');

const fs = require('fs');
const path = require('path');

let browserSync = null;
try { browserSync = require('browser-sync').create(); } catch (e) {}

const paths = {
  src: 'src',
  dist: 'dist',

  pages: [
    'src/index.html',
    'src/privacy-policy.html',
    'src/cookie-policy.html',
    'src/chi-siamo.html',
    'src/soluzioni.html',
    'src/future-lab.html',
    'src/contatti.html'
  ],

  partials: 'src/partials/**/*.html',

  vendorJs: [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.js'
  ],

  vendorCss: [
    'node_modules/@fortawesome/fontawesome-free/css/all.css',
    'node_modules/bootstrap/dist/css/bootstrap.css'
  ],

  faWebfonts: 'node_modules/@fortawesome/fontawesome-free/webfonts/**/*',

  appJs: ['src/**/*.js', '!src/vendors.js'],
  appCss: ['src/**/*.css'],

  assets: [
    'src/**/*',
    '!src/**/*.html',
    '!src/**/*.css',
    '!src/**/*.js'
  ]
};

function passthrough() {
  const Transform = require('stream').Transform;
  return new Transform({ objectMode: true, transform(file, enc, cb) { cb(null, file); } });
}

function clean(cb) {
  const distPath = path.join(__dirname, paths.dist);
  try { fs.rmSync(distPath, { recursive: true, force: true }); } catch (e) {}
  cb();
}

function html() {
  return src(paths.pages, { base: paths.src })
    .pipe(plumber())
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file',
      context: { siteName: 'Your Emotional Sales (YES)', domain: 'youremotionalsales.com' }
    }))
    .pipe(dest(paths.dist))
    .pipe(browserSync ? browserSync.stream() : passthrough());
}

function css() {
  return src([...paths.vendorCss, ...paths.appCss], { allowEmpty: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.join(paths.dist, 'css')))
    .pipe(browserSync ? browserSync.stream() : passthrough());
}

function vendorsJs() {
  return src(paths.vendorJs, { allowEmpty: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('vendors.js'))
    .pipe(terser({ compress: true, mangle: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.join(paths.dist, 'js')))
    .pipe(browserSync ? browserSync.stream() : passthrough());
}

function mainJs() {
  return src(paths.appJs, { allowEmpty: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(terser({ compress: true, mangle: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.join(paths.dist, 'js')))
    .pipe(browserSync ? browserSync.stream() : passthrough());
}

function webfonts() {
  return src(paths.faWebfonts, { allowEmpty: true })
    .pipe(plumber())
    .pipe(dest(path.join(paths.dist, 'webfonts')))
    .pipe(browserSync ? browserSync.stream() : passthrough());
}

function assets() {
  return src(paths.assets, { base: paths.src })
    .pipe(plumber())
    .pipe(dest(paths.dist))
    .pipe(browserSync ? browserSync.stream() : passthrough());
}

function serve(cb) {
  if (!browserSync) {
    console.log('[serve] browser-sync not installed. Run: npm i -D browser-sync');
    cb();
    return;
  }
  browserSync.init({
    server: { baseDir: paths.dist },
    port: 3000,
    open: false,
    notify: false
  });
  cb();
}

function watcher() {
  watch([paths.partials, 'src/**/*.html'], html);
  watch(paths.appCss, css);
  watch(paths.appJs, mainJs);
  watch(paths.assets, assets);
}

const build = series(clean, parallel(html, css, vendorsJs, mainJs, webfonts, assets));
const dev = series(build, serve, watcher);

exports.clean = clean;
exports.html = html;
exports.css = css;
exports.vendorsJs = vendorsJs;
exports.mainJs = mainJs;
exports.webfonts = webfonts;
exports.assets = assets;

exports.build = build;
exports.dist = build;
exports.dev = dev;
exports.default = dev;
