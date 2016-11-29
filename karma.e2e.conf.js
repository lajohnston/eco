// Karma configuration

module.exports = (config) => {
  config.set({
    frameworks: [
      'jasmine',
      'source-map-support',
    ],

    // list of files / patterns to load in the browser
    files: [
      'dist/eco.min.js',
      'spec/e2e/**/*.spec.js',
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    preprocessors: {
      'spec/**/*.js': ['babel'],
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        plugins: ['transform-es2015-modules-umd'],
        sourceMap: 'inline',
      },
    },

    // test results reporter to use
    reporters: ['progress'],

    // web server port
    port: 9876,

    // start these browsers
    browsers: ['PhantomJS', 'Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};
