const getCalledLine = () => {
  const error = new Error()
  const callerLine = error.stack.split('\n')[3]
  const regex = /\((.*):(\d+):(\d+)\)$/
  const match = regex.exec(callerLine)

  return {
    file: match[1],
    line: parseInt(match[2], 10),
  }
}

module.exports = getCalledLine
