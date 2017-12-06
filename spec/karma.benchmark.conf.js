// Karma configuration

module.exports = config => {
  config.set({
    frameworks: ["benchmark"],

    browserNoActivityTimeout: 10000,

    // list of files / patterns to load in the browser
    files: ["../dist/eco.min.js", "benchmark/**/*.spec.js"],

    // list of files to exclude
    exclude: [],

    // test results reporter to use
    reporters: ["benchmark"],

    // web server port
    port: 9876,

    // start these browsers
    browsers: ["Chrome"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1
  });
};
