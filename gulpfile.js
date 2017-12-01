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

/* global require __dirname */
const path = require("path");
const gulp = require("gulp");
const plugins = require("gulp-load-plugins")();
const KarmaServer = require("karma").Server;
const moment = require("moment");

const rollup = require("rollup-stream");
const rollupBabel = require("rollup-plugin-babel");
const sourceStream = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

const now = moment();
const packageJson = require("./package.json");

const header = `/*!
 * eco.js - v${packageJson.version}
 * Built ${now.format("ddd, Do MMM YYYY HH:mm:ss UTC")}
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

  done(
    new plugins.util.PluginError("karma", {
      message: "Karma Tests failed"
    })
  );
}

gulp.task("lint", () =>
  gulp
    .src("src/**/*.js")
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
);

gulp.task(
  "build",
  gulp.parallel("lint", () => {
    return rollup({
      name: "Eco",
      input: "./src/index.js",
      format: "iife",

      plugins: [
        rollupBabel({
          exclude: "node_modules/**",
          externalHelpersWhitelist: ["classCallCheck"]
        })
      ]
    })
      .pipe(sourceStream("eco.min.js"))
      .pipe(buffer())
      .pipe(
        plugins.uglify({
          mangle: {
            except: ["Eco"]
          }
        })
      )
      .pipe(plugins.wrap(`${header} <%= contents %>`))
      .pipe(gulp.dest("dist"));
  })
);

gulp.task("test:unit", done => {
  new KarmaServer(
    {
      configFile: path.join(__dirname, "/spec/karma.unit.conf.js"),
      singleRun: false
    },
    err => karmaErrorHandler(err, done)
  ).start();
});

gulp.task(
  "test:e2e",
  gulp.series("build", done => {
    new KarmaServer(
      {
        configFile: path.join(__dirname, "/spec/karma.e2e.conf.js"),
        singleRun: true
      },
      err => karmaErrorHandler(err, done)
    ).start();
  })
);

gulp.task("test", gulp.series("test:unit", "test:e2e"));
