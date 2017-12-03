/* global require, module */
const moment = require("moment");
const packageJson = require("../package.json");
const rollup = require("rollup-stream");
const rollupBabel = require("rollup-plugin-babel");
const sourceStream = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const babelHelpersList = require("babel-helpers").list;

const now = moment();
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

module.exports = (gulp, plugins) => {
  /**
   * Builds the ./src directory into ./dist/eco.min.js
   */
  function build() {
    return rollup({
      name: "Eco",
      input: "./src/index.js",
      format: "iife",

      plugins: [
        rollupBabel({
          presets: [
            [
              "es2015",
              {
                modules: false
              }
            ]
          ],
          plugins: ["external-helpers"],
          exclude: "node_modules/**",

          // fix rollup regression, remove when rollup/rollup#1595 gets resolved
          externalHelpersWhitelist: babelHelpersList.filter(
            helperName => helperName !== "asyncGenerator"
          )
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
  }

  /**
   * Watches the ./src directory and rebuild if changes are made
   */
  function watch() {
    return gulp.watch("./src/**/*", build);
  }

  return { build, watch };
};
