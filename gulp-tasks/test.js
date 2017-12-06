/* global require, module, __dirname */
const path = require("path");
const KarmaServer = require("karma").Server;

module.exports = (gulp, plugins) => {
  function handleKarmaErrors(err, done) {
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

  function benchmark(done) {
    return new KarmaServer(
      {
        configFile: path.join(__dirname, "../spec/karma.benchmark.conf.js")
      },
      err => handleKarmaErrors(err, done)
    ).start();
  }

  function e2e(done) {
    return new KarmaServer(
      {
        configFile: path.join(__dirname, "../spec/karma.e2e.conf.js")
      },
      err => handleKarmaErrors(err, done)
    ).start();
  }

  function runUnitTests() {
    return gulp.src("spec/unit/**/*.spec.js").pipe(
      plugins.jasmine({
        includeStackTrace: true,
        errorOnFail: false
      })
    );
  }

  function watchUnitTests() {
    return gulp.watch(
      ["src/**/*.js", "spec/unit/**/*.spec.js"],
      { ignoreInitial: false },
      runUnitTests
    );
  }

  return {
    e2e,
    benchmark,
    watchUnitTests
  };
};
