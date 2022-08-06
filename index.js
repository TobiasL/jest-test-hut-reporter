const isValidImage = require('./src/isValidImage')
const handleRunCompletion = require('./src/handleRunCompletion')
const { saveImage, getImageCollection } = require('./src/collectImages')
const getJestGlobalData = require('./src/getJestGlobalData')
const getCalledLine = require('./src/getCalledLine')

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
  constructor(globalConfig, options) {
    this.apiKey = process.env.TEST_HUT_KEY || options?.apiKey
  }

  async onRunComplete(contexts, results) {
    if (!this.apiKey) return
    if (results.numFailedTests !== 0) return

    const images = await getImageCollection()

    await handleRunCompletion(results, this.apiKey, images)
  }
}

module.exports = TestHutReporter
module.exports.addImage = addImage
