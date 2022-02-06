const path = require('path')
const axios = require('axios')
const { getVersion } = require('jest')

const readFileCode = require('./readFileCode')

const packagePath = path.resolve(__dirname, '..', 'package.json')
const { version } = require(packagePath)

const jestVersion = getVersion()
const TEST_INGESTER_URL = 'http://localhost:4000/api/tests'

const mapCompleteResult = (results, apiKey) => {
  const files = results.testResults.map((testResult) => {
    const testNames = testResult.testResults.map((test) => test.fullName)
    const testLines = testResult.testResults.map((test) => test.location?.line || null)

    return {
      path: testResult.testFilePath,
      testNames,
      testLines,
    }
  })


  return {
    startTime: new Date(results.startTime),
    endTime: new Date(),
    files,
    apiKey,
    nodeVersion: process.version,
    reporterVersion: version,
    jestVersion,
  }
}

const sendToTestIngester = async (result) => {
  const withCode = await readFileCode(result.files)

  // TODO: Create a ref ID here?
  const payloadToSend = {
    ...result,
    files: withCode,
  }

  try {
    await axios.post(TEST_INGESTER_URL, payloadToSend)
  } catch (error) {
    const isUnauthenticated = error?.response?.status === 401

    if (isUnauthenticated) {
      return console.error('API KEY is missing or has been disabled for the project.')
    }

    return console.error(`Error when sending the test report to Test Hut, error: ${error?.code}`)
  }
}

const handleRunCompletion = async (results, apiKey) => {
  const completeResult = mapCompleteResult(results, apiKey)

  await sendToTestIngester(completeResult)
}

module.exports = handleRunCompletion
