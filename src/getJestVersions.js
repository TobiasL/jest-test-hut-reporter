const path = require('path')
const { getVersion } = require('jest')

const packagePath = path.resolve(__dirname, '..', 'package.json')
const { version } = require(packagePath)
const jestVersion = getVersion()

const getJestVersions = () => ({
  reporterVersion: version,
  jestVersion,
})

module.exports = getJestVersions
