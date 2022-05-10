const handleRunCompletion = require('./src/handleRunCompletion')
const { getJestGlobalData, getCalledLine } = require('./helper')

let images = []

// TODO: Make sure that it is a PNG?
// TODO: Get Buffer from something like Puppeteer page.screenshot...
// TODO: Ensure that it only accepts base64 images.
const addImage = (imageBuffer) => {
  const { testPath } = getJestGlobalData()
  const { line } = getCalledLine()

  images.push({
    src: imageBuffer,
    path: testPath.replace(process.cwd(), '.'),
    line,
  })
}

// TODO: Warn if the  --testLocationInResults is not provided.
class TestHutReporter {
  constructor(globalConfig, options) {
    this.apiKey = process.env.TEST_HUT_KEY || options?.apiKey

    images = []
  }

  async onRunComplete(contexts, results) {
    if (!this.apiKey) return
    if (results.numFailedTests !== 0) return

    await handleRunCompletion(results, this.apiKey, images)
  }
}

module.exports = TestHutReporter
module.exports.addImage = addImage
