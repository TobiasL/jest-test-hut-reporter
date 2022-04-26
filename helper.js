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

const getCalledLine = () => {
  const error = new Error()
  const callerLine = error.stack.split('\n')[3]
  const regex = /\((.*):(\d+):(\d+)\)$/
  const match = regex.exec(callerLine)

  return {
    file: match[1],
    line: parseInt(match[2], 10)
  };
}

module.exports = { getJestGlobalData, getCalledLine }
