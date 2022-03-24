const { getCalledLine } = require('../helper')

test('helper function to get the filename and line of the function calling it', () => {
  const calledLine = getCalledLine()

  expect(calledLine).toEqual({
    file: `${process.cwd()}/test/helper.test.js`,
    line: 4,
  })
})
