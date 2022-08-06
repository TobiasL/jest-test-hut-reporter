const getJestGlobalData = () => {
  let testPath
  let testName

  [...Object.getOwnPropertySymbols(global)].forEach((key) => {
    if (global[key].state && global[key].matchers) {
      const state = global[key].state || {}

      testPath = state.testPath
      testName = state.currentTestName
    }
  })

  return { testPath, testName }
}

module.exports = getJestGlobalData
