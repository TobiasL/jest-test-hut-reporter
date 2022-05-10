const isValidImage = require('./src/isValidImage')
const handleRunCompletion = require('./src/handleRunCompletion')
const { getJestGlobalData, getCalledLine } = require('./helper')

let images = []

const addImage = (imageBuffer) => {
  const validImage = isValidImage(imageBuffer)

  if (!validImage) {
    // eslint-disable-next-line no-console
    return console.warn('Invalid image sent into the "addImage" function. Base64 encoded PNG is required.')
  }

  const { testPath } = getJestGlobalData()
  const { line } = getCalledLine()

  return images.push({
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
