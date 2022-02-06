// TODO: Implement the helpers to get images and extra message.
const getJestGlobalData = () => {
  let testPath, testName

  [...Object.getOwnPropertySymbols(global)].forEach((key) => {
    if (global[key].state && global[key].matchers) {
      const state = global[key].state || {}

      testPath = state.testPath
      testName = state.currentTestName
    }
  })

  return { testPath, testName }
}

const addMessage = (message) => {
  const { testPath, testName } = getJestGlobalData()

  console.log(`addMessage, message: ${message}, testPath: ${testPath}, testName: ${testName}`)
}

// TODO: Make sure that it is a PNG?
// TODO: Get Buffer from something like Puppeteer page.screenshot...
const addImage = (imageBuffer) => {
  const { testPath, testName } = getJestGlobalData()

  console.log(`addImage, imageBuffer: ${imageBuffer}, testPath: ${testPath}, testName: ${testName}`)
}

module.exports.addMessage = addMessage
module.exports.addImage = addImage

