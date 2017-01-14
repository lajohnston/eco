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

/* eslint-disable import/no-extraneous-dependencies */
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const KarmaServer = require('karma').Server;
const path = require('path');
const moment = require('moment');

const src = [
  'src/components/Collection.js',
  'src/**/*.js',
  'src/index.js',
];

const now = moment();
const packageJson = require('./package.json');

const header = `/*!
 * eco.js - v${packageJson.version}
 * Built ${now.format('ddd, MMM YYYY HH:mm:ss UTC')}
 *
 * https://github.com/lajohnston/eco
 *
 * eco.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
`;

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
    .pipe(plugins.uglify())
    .pipe(plugins.wrap(`${header} <%= contents %>`))
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
