const gulp = require('gulp')
const gutil = require('gulp-util')
const ftp = require('vinyl-ftp')
const clean = require('gulp-clean')
const debug = require('gulp-debug')
const browserify = require('browserify')
const babelify = require('babelify')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')
const vueify = require('vueify')
const envify = require('envify/custom')
const sourcemaps = require('gulp-sourcemaps')
const source = require('vinyl-source-stream')
const cssimport = require('gulp-import-css')
const sass = require('gulp-sass')
const rsync = require('gulp-rsync')

const filenamesToJson = require('gulp-filenames-to-json')

const wbBuild = require('workbox-build')

const deploy = require('./deploy.json')

const globs = {
  source: {
    src1: [
      '.babelrc',
      '.eslintrc.json',
      'ecosystem.config.json',
      'gulpfile.js',
      'keys.json',
      'package-lock.json',
      'package.json'
    ],
    dest1: 'upload/dev/',

    src2: ['src/**'],
    dest2: 'upload/dev/src/'
  },

  server: {
    src: 'src/server/**',
    dest: 'upload/'
  },

  config: {
    src: [
      'package.json',
      'package-lock.json',
      'gulpfile.js',
      'keys.json',
      '.babelrc',
      'ecosystem.config.json',
      '.eslintrc.json'
    ],
    dest: 'upload/'
  },

  scripts: {
    src: ['src/client/index.js'],
    dest: 'upload/www/js/'
  },

  manifest: {
    src: ['src/manifest.json', 'src/browserconfig.xml'],
    dest: 'upload/www/'
  },

  styles: {
    src: ['src/client/style.scss'],
    dest: 'upload/www/css/'
  },

  templates: {
    src: ['src/index.html'],
    dest: 'upload/www/'
  },

  assets: {
    src: 'src/assets/**',
    dest: 'upload/www/'
  },

  fonts: {
    src: [
      'node_modules/cryptocoins-icons/webfont/**',
      // 'node_modules/cryptocurrency-icons/svg/**'
    ],
    dest: 'upload/www/fonts/'
  },

  ftp: {
    src: 'upload/**',
    dest: 'upload/'
  },

  sw: {
    globDirectory: 'upload/www/',
    dest: 'src/sw.js'
  },

  sw2: {
    src: 'src/service-worker.js',
    dest: 'upload/www/sw.js',
    globDirectory: 'upload/www'
  },

  rsync: {
    src: 'upload/**',
    dest: '/var/upload',
    root: 'upload/'
  }
}

gulp.task('clean', () => {
  return gulp.src('upload/*', { read: false }).pipe(clean())
})

gulp.task('server', () => {
  return gulp.src(globs.server.src).pipe(gulp.dest(globs.server.dest))
})

gulp.task('source', () => {
  return gulp
    .src(globs.source.src1)
    .pipe(gulp.dest(globs.source.dest1))
    .pipe(gulp.src(globs.source.src2))
    .pipe(gulp.dest(globs.source.dest2))
})

gulp.task('config', () => {
  return gulp.src(globs.config.src).pipe(gulp.dest(globs.config.dest))
})

gulp.task('fonts', () => {
  return gulp.src(globs.fonts.src).pipe(gulp.dest(globs.fonts.dest))
})

gulp.task('scripts:build', () => {
  const bundler = browserify({
    entries: globs.scripts.src,
    debug: true,
    transform: [
      ['envify', { global: true, _: 'purge', NODE_ENV: 'production' }],
      vueify,
      babelify
    ]
  })

  return (
    bundler
      .bundle()
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .on('error', gutil.log)
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest(globs.scripts.dest))
  )
})

gulp.task('sw', () => {
  return wbBuild
    .generateSW({
      globDirectory: globs.sw.globDirectory,
      swDest: globs.sw.dest,
      globPatterns: ['**/*.{html,js,css}'],
      globIgnores: ['sw.js'],
      skipWaiting: true,
      clientsClaim: true
    })
    .then(() => {
      // console.log('Service worker generated.')
    })
    .catch(err => {
      console.log('[ERROR] This happened: ' + err)
    })
})

gulp.task('sw2', () => {
  // gulp.src(globs.sw2.src).pipe(gulp.dest(globs.sw2.dest))

  return wbBuild.injectManifest({
    swSrc: globs.sw2.src,
    swDest: globs.sw2.dest,
    globDirectory: globs.sw2.globDirectory,
    globIgnores: ['sw.js'],
    staticFileGlobs: [
      // 'js/**/*.js',
      // 'css/style.css',
      'images/**/*.*',
      'index.html'
    ]
  })
})

gulp.task('manifest', () => {
  return gulp.src(globs.manifest.src).pipe(gulp.dest(globs.manifest.dest))
})

gulp.task('scripts', gulp.series('scripts:build', 'manifest'))

gulp.task('styles', () => {
  return gulp
    .src(globs.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssimport())
    .pipe(debug({ title: 'cssimport:' }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(globs.styles.dest))
})

gulp.task('templates', () => {
  return gulp.src(globs.templates.src).pipe(gulp.dest(globs.templates.dest))
})

gulp.task('assets', () => {
  return gulp.src(globs.assets.src).pipe(gulp.dest(globs.assets.dest))
})

// ftp
const ftpOptions = {
  host: deploy.ftp.host,
  user: deploy.ftp.user,
  password: deploy.ftp.password,
  parallel: 10,
  log: gutil.log
}

gulp.task('ftp:clean', cb => {
  const conn = ftp.create(ftpOptions)
  conn.rmdir(globs.ftp.dest, () => { })
  cb()
})

gulp.task('ftp', cb => {
  const conn = ftp.create(ftpOptions)
  return gulp
    .src(globs.ftp.src, { base: 'upload', buffer: false })
    .pipe(conn.newer(globs.ftp.dest)) // only upload newer files
    .pipe(conn.dest(globs.ftp.dest))
})

gulp.task('rsync', () => {
  return gulp.src(globs.rsync.src).pipe(
    rsync({
      root: globs.rsync.root,
      hostname: deploy.rsync.hostname,
      username: deploy.rsync.username,
      destination: globs.rsync.dest,
      archive: true,
      silent: true,
      compress: true,
      relative: true,
      incremental: true,
      // progress: true,
      // dryrun: true,
      chmod: 'ugo=rwX'
    })
  )
})

// Build
gulp.task(
  'build',
  gulp.series(
    'styles',
    'fonts',
    'server',
    'config',
    'scripts',
    'templates',
    'assets',
    'sw',
    'sw2'
  )
)

gulp.task('deploy', gulp.series('clean', 'build', 'source', 'rsync'))

// default
gulp.task('default', gulp.series('clean', 'build'))
