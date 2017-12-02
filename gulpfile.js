/**
 * Eco gulpfile
 *
 * Available tasks:
 *      gulp.lint
 *      gulp build
 *      gulp test:e2e
 */

/* global require */
require("babel-register")({
  presets: ["es2015"]
});

const gulp = require("gulp");
const plugins = require("gulp-load-plugins")();

function getTask(task) {
  return require(`./gulp-tasks/${task}`)(gulp, plugins);
}

// Run source code through eslint
gulp.task("lint", getTask("lint"));

// Builds the project into dist/eco.min.js
gulp.task("build", gulp.parallel("lint", getTask("build")));

// Runs e2e browser tests
gulp.task("e2e", gulp.series("build", getTask("e2e")));
