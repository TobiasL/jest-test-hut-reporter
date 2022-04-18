const getJestVersions = require('./getJestVersions')
const getGitSHA = require('./getGitSHA')

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
    ...getJestVersions(),
    gitSHA: getGitSHA(),
    startTime: new Date(results.startTime),
    endTime: new Date(),
    files,
    apiKey,
    nodeVersion: process.version,
  }
}

module.exports = mapCompleteResult
