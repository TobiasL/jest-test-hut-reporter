const axios = require('axios')

const mapCompleteResult = require('./mapCompleteResult')

const sendToTestIngester = async (payloadToSend) => {
  const ingesterUrl = process.env.TEST_INGESTER_URL || 'http://localhost:4000/api/tests'

  try {
    await axios.post(ingesterUrl, payloadToSend)
  } catch (error) {
    const isUnauthenticated = error?.response?.status === 401

    if (isUnauthenticated) {
      return console.error('API KEY is missing or has been disabled for the project.')
    }

    return console.error(`Error when sending the test report to Test Hut, error: ${error?.code}`)
  }
}

const handleRunCompletion = async (results, apiKey, images) => {
  const completeResult = mapCompleteResult(results, apiKey, images)

  await sendToTestIngester(completeResult)
}

module.exports = handleRunCompletion
