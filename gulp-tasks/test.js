/* global require, module, __dirname */
const path = require("path");
const KarmaServer = require("karma").Server;

module.exports = (gulp, plugins) => {
  function runUnitTests() {
    return gulp.src("spec/unit/**/*.spec.js").pipe(
      plugins.jasmine({
        includeStackTrace: true,
        errorOnFail: false
      })
    );
  }

  return {
    e2e: done =>
      new KarmaServer(
        {
          configFile: path.join(__dirname, "../spec/karma.e2e.conf.js"),
          autoWatch: true,
          singleRun: false
        },
        err => {
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
      ).start(),

    watchUnitTests: () =>
      gulp.watch(
        ["src/**/*.js", "spec/unit/**/*.spec.js"],
        { ignoreInitial: false },
        runUnitTests
      )
  };
};
