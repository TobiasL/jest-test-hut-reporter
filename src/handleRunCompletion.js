const axios = require('axios')

const mapCompleteResult = require('./mapCompleteResult')

const sendToTestIngester = async (result) => {
  const filesWithUpdatedPaths = result.files.map((file) => ({
    ...file,
    path: file.path.replace(process.cwd(), '.'),
  }))

  const payloadToSend = {
    ...result,
    files: filesWithUpdatedPaths,
  }

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

const handleRunCompletion = async (results, apiKey) => {
  const completeResult = mapCompleteResult(results, apiKey)

  await sendToTestIngester(completeResult)
}

module.exports = handleRunCompletion
