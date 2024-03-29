const isValidImage = require('./isValidImage')
const handleRunCompletion = require('./handleRunCompletion')
const { saveImage, getImageCollection } = require('./collectImages')
const getJestGlobalData = require('./getJestGlobalData')
const getCalledLine = require('./getCalledLine')

const addImage = async (imageBuffer) => {
  const validImage = isValidImage(imageBuffer)

  if (!validImage) {
    // eslint-disable-next-line no-console
    return console.warn('Invalid image sent into the "addImage" function. Base64 encoded PNG is required.')
  }

  const { testPath } = getJestGlobalData()
  const { line } = getCalledLine()

  return saveImage({
    src: imageBuffer,
    path: testPath.replace(process.cwd(), '.'),
    line,
  })
}

class TestHutReporter {
  // eslint-disable-next-line class-methods-use-this
  async onRunComplete(contexts, results) {
    const apiKey = process.env.TEST_HUT_KEY
    const ingesterUrl = process.env.TEST_INGESTER_URL || 'https://test-hut.tobiaslindstrom.se/api/tests'

    if (!apiKey) return
    if (results.numFailedTests !== 0) return

    const images = await getImageCollection()

    await handleRunCompletion(results, apiKey, ingesterUrl, images)
  }
}

module.exports = TestHutReporter
module.exports.addImage = addImage
