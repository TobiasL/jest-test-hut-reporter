const axios = require('axios')

const readFileCode = require('./readFileCode')
const mapCompleteResult = require('./mapCompleteResult')

const TEST_INGESTER_URL = process.env.TEST_INGESTER_URL || 'http://localhost:4000/api/tests'

const sendToTestIngester = async (result) => {
  const withCode = await readFileCode(result.files)

  const payloadToSend = {
    ...result,
    files: withCode,
  }

  try {
    await axios.post(TEST_INGESTER_URL, payloadToSend)
  } catch (error) {
    const isUnauthenticated = error?.response?.status === 401

    if (isUnauthenticated) {
      return console.error('API KEY is missing or has been disabled for the project.')
    }

    return console.error(`Error when sending the test report to Test Hut, error: ${error?.code}`)
  }
}

const handleRunCompletion = async (results, apiKey) => {
  const completeResult = mapCompleteResult(results, apiKey)

  await sendToTestIngester(completeResult)
}

module.exports = handleRunCompletion
