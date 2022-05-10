const axios = require('axios')
const { uniq, uniqBy } = require('lodash')

const mapCompleteResult = require('./mapCompleteResult')

const sendToTestIngester = async (payloadToSend) => {
  const ingesterUrl = process.env.TEST_INGESTER_URL || 'http://localhost:4000/api/tests'

  try {
    await axios.post(ingesterUrl, payloadToSend)
  } catch (error) {
    const isUnauthenticated = error?.response?.status === 401

    if (isUnauthenticated) {
      // eslint-disable-next-line no-console
      return console.error('API KEY is missing or has been disabled for the project.')
    }

    // eslint-disable-next-line no-console
    return console.error(`Error when sending the test report to Test Hut, error: ${error?.code}`)
  }

  return null
}

const hasDuplicateTests = (result) => {
  const testNames = result.files.map((file) => file.testNames).flat()
  const uniqueTestNames = uniq(testNames)

  return uniqueTestNames.length !== testNames.length
}

const hasDuplicateImages = (result) => {
  const uniqueImages = uniqBy(result.images, 'src')

  return uniqueImages.length !== result.images.length
}

const handleRunCompletion = async (results, apiKey, images) => {
  const completeResult = mapCompleteResult(results, apiKey, images)

  const existDuplicateImages = hasDuplicateImages(completeResult)
  const existDuplicateTests = hasDuplicateTests(completeResult)

  if (existDuplicateImages) {
    // eslint-disable-next-line no-console
    return console.error('Duplicate images have been added through the "addImage" function.')
  }

  if (existDuplicateTests) {
    // eslint-disable-next-line no-console
    return console.error('Duplicate test names.')
  }

  return sendToTestIngester(completeResult)
}

module.exports = handleRunCompletion
