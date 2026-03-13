module.exports = {
  default: {
    require: [
      'features/support/**/*.ts',
      'features/step_definitions/*.steps.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    parallel: 1,
    timeout: 180000,
    dryRun: false,
    failFast: false,
    strict: true,
    order: 'defined'
  },
  
  headless: {
    require: [
      'features/support/**/*.ts',
      'features/step_definitions/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    parallel: 2,
    timeout: 180000,
    order: 'defined'
  },

  headed: {
    require: [
      'features/support/**/*.ts',
      'features/step_definitions/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    parallel: 1,
    timeout: 180000,
    order: 'defined'
  }
};
