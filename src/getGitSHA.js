const getGitSHA = () => process.env.GITHUB_SHA || process.env.CI_COMMIT_SHA || process.env.CI_BUILD_REF

module.exports = getGitSHA
