/**
 * Eco gulpfile
 */

/* global require */

// For auto-transpiling spec files
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
gulp.task("build", gulp.parallel("lint", getTask("build").build));

// Builds the project and rebuilds when changes are made
gulp.task("watch", gulp.series("build", getTask("build").watch));

// Runs the ./spec/e2e tests within browsers and reruns if changes are made
gulp.task(
  "e2e",
  gulp.series("build", gulp.parallel("watch", getTask("test").e2e))
);

// Runs the benchmark test suite
gulp.task("bench", gulp.series("build", getTask("test").benchmark));

// Runs the ./spec/unit tests in node.js and reruns if changes are made
gulp.task("unit", getTask("test").watchUnitTests);
