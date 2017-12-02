/* global require, module, __dirname */
const path = require("path");
const KarmaServer = require("karma").Server;

module.exports = (gulp, plugins) => done =>
  new KarmaServer(
    {
      configFile: path.join(__dirname, "../spec/karma.e2e.conf.js"),
      singleRun: true
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
  ).start();
