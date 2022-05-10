const path = require('path')
// eslint-disable-next-line import/no-extraneous-dependencies
const { getVersion } = require('jest')

const packagePath = path.resolve(__dirname, '..', 'package.json')
// eslint-disable-next-line import/no-dynamic-require
const { version } = require(packagePath)
const jestVersion = getVersion()

const getJestVersions = () => ({
  reporterVersion: version,
  jestVersion,
})

module.exports = getJestVersions
