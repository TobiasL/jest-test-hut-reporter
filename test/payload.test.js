const axios = require('axios')
const fs = require('fs')

const TestHutReporter = require('../index')
const mathTestsResult = require('./jest-results/mathResult.json')
const duplicateTestsResult = require('./jest-results/duplicateTestsResult.json')

jest.mock('axios')
// TODO: Fix the mocking of process.cwd().

afterEach(() => jest.clearAllMocks())

const content = fs.readFileSync('./test/example-image.png', { encoding: 'base64' })

test('assert the payload format', async () => {
  process.env = Object.assign(process.env, {
    TEST_HUT_KEY: 'API_KEY',
    GITHUB_SHA: '4bb30ac6f1ead3b774fe2bd0fab0fc3d2a385803',
  })

  const reporter = new TestHutReporter({})

  // The line number and filename is important to assert in the test.
  await TestHutReporter.addImage(content)

  await reporter.onRunComplete(null, mathTestsResult)

  expect(axios.post).toHaveBeenCalledWith('https://test-hut.tobiaslindstrom.se/api/tests', {
    apiKey: 'API_KEY',
    startTime: expect.any(Date),
    endTime: expect.any(Date),
    files: [{
      path: './test/multiplication.test.js',
      code: null,
      testLines: [1, 7],
      testNames: ['multiplication test 1', 'multiplication test 2'],
    }, {
      path: './test/addition.test.js',
      code: null,
      testLines: [1, 7],
      testNames: ['addition test 1', 'addition test 2'],
    }, {
      path: './test/subtraction.test.js',
      code: null,
      testLines: [1, 7],
      testNames: ['subtraction test 1', 'subtraction test 2'],
    }],
    jestVersion: '27.5.0',
    nodeVersion: expect.any(String),
    reporterVersion: '0.0.2',
    gitSHA: '4bb30ac6f1ead3b774fe2bd0fab0fc3d2a385803',
    images: [{
      src: content,
      path: './test/payload.test.js',
      line: 24,
    }],
  })
})

test('dont\'t send the payload if there are duplicate images', async () => {
  process.env = Object.assign(process.env, {
    TEST_HUT_KEY: 'API_KEY',
    GITHUB_SHA: '4bb30ac6f1ead3b774fe2bd0fab0fc3d2a385803',
  })

  const reporter = new TestHutReporter({})

  // The line number and filename is important to assert in the test.
  await TestHutReporter.addImage(content)
  await TestHutReporter.addImage(content)

  await reporter.onRunComplete(null, mathTestsResult)

  expect(axios.post).not.toHaveBeenCalled()
})

test('dont\'t send the payload if there are duplicate tests', async () => {
  process.env = Object.assign(process.env, {
    TEST_HUT_KEY: 'API_KEY',
    GITHUB_SHA: '4bb30ac6f1ead3b774fe2bd0fab0fc3d2a385803',
  })

  const reporter = new TestHutReporter({})
  await reporter.onRunComplete(null, duplicateTestsResult)

  expect(axios.post).not.toHaveBeenCalled()
})
