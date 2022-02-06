const axios = require('axios')

const TestHutReporter = require('../index')

jest.mock('axios')

test('No api key', async () => {
  const reporter = new TestHutReporter({})
  await reporter.onRunComplete({})

  expect(axios.post).not.toHaveBeenCalled()
})

test('With failed tests', async () => {
  process.env = Object.assign(process.env, { TEST_HUT_KEY: 'API_KEY' })
  const reporter = new TestHutReporter({})
  await reporter.onRunComplete({}, {numFailedTests:1, testResults: []})

  expect(axios.post).not.toHaveBeenCalled()
})

test('Successful test run', async () => {
  process.env = Object.assign(process.env, { TEST_HUT_KEY: 'API_KEY' })
  const reporter = new TestHutReporter({})
  await reporter.onRunComplete({}, {numFailedTests:0, testResults: []})

  expect(axios.post).toHaveBeenCalled()
})

test('Unauthenticated when sending report', async () => {
  axios.post.mockImplementationOnce(() => {
    const error = new Error('Unauthenticated')
    error.response = { status: 401 }

    throw error
  })

  process.env = Object.assign(process.env, { TEST_HUT_KEY: 'API_KEY' })
  const reporter = new TestHutReporter({})
  await reporter.onRunComplete({}, {numFailedTests:0, testResults: []})

  expect(axios.post).toHaveBeenCalled()
})

test('Connection error when sending report', async () => {
  axios.post.mockImplementationOnce(() => {
    throw new Error('Connection error')
  })

  process.env = Object.assign(process.env, { TEST_HUT_KEY: 'API_KEY' })
  const reporter = new TestHutReporter({})
  await reporter.onRunComplete({}, {numFailedTests:0, testResults: []})

  expect(axios.post).toHaveBeenCalled()
})
