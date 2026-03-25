var argv = require('yargs').argv;

process.env.CHROME_BIN = require('puppeteer').executablePath();

var browserName = 'ChromeHeadlessCustom';
if (argv.chrome) {
  browserName = 'ChromeHeadlessCustom'
}
else if (argv.firefox) {
  browserName = 'Firefox'
}
const flags = [
  '--disable-extensions',
  '--no-proxy-server',
  '--js-flags="--max_old_space_size=6500"',
  '--high-dpi-support=1',
  '--no-sandbox',
  '--headless',
  '--disable-gpu',
  '--window-size=800,800',
];
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine','karma-typescript'],
    files: [
      './node_modules/jquery/dist/jquery.js',
      './node_modules/es6-promise/dist/es6-promise.js',
      { pattern: './src/**/*.ts' },
      { pattern: './test/**/*.ts' },
      { pattern: './test/**/*.html', served: true, included: false }
    ],
    exclude: [],
    preprocessors: {
      './src/**/*.ts': ['karma-typescript'],
      './test/**/*.ts': ['karma-typescript']
    },
    reporters: argv.chrome ? ['kjhtml'] : ['spec', 'karma-typescript', 'progress', 'junit', 'coverage'],
    autoWatch: true,
    browsers: [browserName],
    browserNoActivityTimeout: 300000,
    plugins: [
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-spec-reporter',
      'karma-jasmine-html-reporter',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-typescript'
    ],
    customLaunchers: {
      'ChromeHeadlessCustom': {
        base: 'Chrome',
        flags: flags.concat("--no-sandbox", "--window-size=800,800"),
      },
    },
    junitReporter: {
      outputDir: 'test-results',
      outputFile: 'testresults.xml',
      useBrowserName: false
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'cobertura', subdir: '.', file: 'cobertura-coverage.xml' },
        { type: 'html', subdir: 'html' }
      ]
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.test.json',
      reports: {
        "cobertura": {
          "directory": "coverage",
          "filename": "cobertura-coverage.xml"
        },
        "html": "coverage/html"
      }
    },
    retryLimit: 0,
    logLevel: argv.debug ? config.LOG_DEBUG : config.LOG_INFO,
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    }
  });
};