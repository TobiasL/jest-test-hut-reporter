const { readFile } = require('fs/promises')

const getJestVersions = require('./getJestVersions')
const getGitSHA = require('./getGitSHA')

const getFileCode = async (filePath) => {
  try {
    const content = await readFile(filePath)

    return content.toString()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error when reading file content, error:', error.message)

    return null
  }
}

const getFileResult = async (testResult) => {
  const testNames = testResult.testResults.map((test) => test.fullName)
  const testLines = testResult.testResults.map((test) => test.location?.line || null)
  const code = await getFileCode(testResult.testFilePath)

  return {
    path: testResult.testFilePath.replace(process.cwd(), '.'),
    code,
    testNames,
    testLines,
  }
}

const mapCompleteResult = async (results, apiKey, images) => {
  const files = await Promise.all(results.testResults.map(getFileResult))

  return {
    ...getJestVersions(),
    gitSHA: getGitSHA(),
    startTime: new Date(results.startTime),
    endTime: new Date(),
    files,
    apiKey,
    nodeVersion: process.version,
    images,
  }
}

module.exports = mapCompleteResult
