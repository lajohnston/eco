/**
 * Ecos gulpfile
 *
 * Available tasks:
 *      gulp build
 *      gulp test
 *
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
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('test', (done) => {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});
