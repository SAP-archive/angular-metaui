// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessLocal', 'ChromeHeadlessCI', 'FirefoxHeadless'],

    customLaunchers: {
      "ChromeHeadlessLocal": {
        "base": "ChromeHeadless",
        "flags": [
          "--window-size=1024,768"
        ]
      },
      "ChromeHeadlessCI": {
        "base": "ChromeHeadless",
        "flags": [
          "--window-size=1024,768",
          "--no-sandbox"
        ]
      },
      "FirefoxHeadless": {
        "base": "Firefox",
        "flags": [
          "-headless"
        ]
      }
    },
    singleRun: false,

    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,
    reportSlowerThan: 1000
  });
};
