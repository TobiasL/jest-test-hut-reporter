const handleRunCompletion = require('./src/handleRunCompletion')
const helper = require('./helper')

// TODO: Warn if the  --testLocationInResults is not provided.
// TODO: Set a maximum file size for the code field. 500 lines?
class TestHutReporter {
  constructor(globalConfig, options) {
    this.apiKey = process.env.TEST_HUT_KEY || options?.apiKey
  }

  async onRunComplete(contexts, results) {
    if (!this.apiKey) return
    if (results.numFailedTests !== 0) return

    return await handleRunCompletion(results, this.apiKey)
  }
}

module.exports = TestHutReporter;
module.exports.helpers = helper
