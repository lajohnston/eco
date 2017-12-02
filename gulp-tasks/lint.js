/* global module */
module.exports = (gulp, plugins) => () =>
  gulp
    .src("src/**/*.js")
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
