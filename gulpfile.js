/**
 * Ecos gulpfile
 *
 * Available tasks:
 *      gulp build
 *      gulp test
 *      gulp test:unit
 *      gulp test:e2e
 */

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const KarmaServer = require('karma').Server;

/**
 * Simple bundler to bundle ES6 classes into one file, without using a module system
 */
function bundleJs() {
    return gulp.src(['src/componentCollection.js', 'src/entity.js', 'src/ecos.js'])
        .pipe(plugins.concat('ecos.js'))
        .pipe(plugins.replace('export default class', 'class'))
        .pipe(plugins.replace(/import {.*} from '.*';/g, ''));
};

gulp.task('build', () => {
    return bundleJs()
        .pipe(plugins.babel({
            presets: ['es2015']
        }))
        .pipe(plugins.wrap('(function() { <%= contents %> window.Ecos = Ecos;})();'))
        .pipe(gulp.dest('dist'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename('ecos.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('test:unit', (done) => {
    new KarmaServer({
        configFile: __dirname + '/karma.unit.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('test:e2e', gulp.series('build', (done) => {
    new KarmaServer({
        configFile: __dirname + '/karma.e2e.conf.js',
        singleRun: true
    }, (err) => {
        if (err === 0) {
            done();
            return;
        }

        done(new plugins.util.PluginError('karma', {
            message: 'Karma Tests failed'
        }));
    }).start();
}));

gulp.task('test', gulp.series('test:unit', 'test:e2e'));