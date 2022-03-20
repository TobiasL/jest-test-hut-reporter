const path = require('path')
const { getVersion } = require('jest')

const packagePath = path.resolve(__dirname, '..', 'package.json')
const { version } = require(packagePath)
const jestVersion = getVersion()

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

module.exports = mapCompleteResult
