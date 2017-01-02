/**
 * Eco gulpfile
 *
 * Available tasks:
 *      gulp.lint
 *      gulp build
 *      gulp test
 *      gulp test:unit
 *      gulp test:e2e
 */

const gulp = require('gulp'); // eslint-disable-line import/no-extraneous-dependencies
const plugins = require('gulp-load-plugins')(); // eslint-disable-line import/no-extraneous-dependencies
const KarmaServer = require('karma').Server; // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');

const src = [
  'src/entities/EntityIterator.js',
  'src/**/*.js',
  'src/index.js',
];

function karmaErrorHandler(err, done) {
  if (err === 0) {
    done();
    return;
  }

  done(new plugins.util.PluginError('karma', {
    message: 'Karma Tests failed',
  }));
}

/**
 * Simple bundler to bundle ES6 classes into one file, without using a module system
 */
function bundleJs() {
  return gulp.src(src)
    .pipe(plugins.concat('eco.js'))
    .pipe(plugins.replace(/import .* from '.*';/g, ''))
    .pipe(plugins.replace('export default class', 'class'))
    .pipe(plugins.replace(/export default .*/g, ''));
}

gulp.task('lint', () => (
  gulp.src('src/**/*.js')
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
));

gulp.task('build', gulp.parallel('lint', () => {
  const wrapper = '(function() { <%= contents %> window.Eco = function () { return createEcoInstance(); };})();';

  return bundleJs()
    .pipe(plugins.babel({
      presets: ['es2015'],
    }))
    .pipe(plugins.wrap(wrapper))
    .pipe(gulp.dest('dist'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename('eco.min.js'))
    .pipe(gulp.dest('dist'));
}));

gulp.task('test:unit', (done) => {
  new KarmaServer({
    configFile: path.join(__dirname, '/karma.unit.conf.js'),
    singleRun: false,
  }, err => karmaErrorHandler(err, done)).start();
});

gulp.task('test:e2e', gulp.series('build', (done) => {
  new KarmaServer({
    configFile: path.join(__dirname, '/karma.e2e.conf.js'),
    singleRun: true,
  }, err => karmaErrorHandler(err, done)).start();
}));

gulp.task('test', gulp.series('test:unit', 'test:e2e'));
