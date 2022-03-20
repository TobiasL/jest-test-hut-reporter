const { readFile } = require('fs/promises')

const readFileCode = async (files) => {
  const readContents = files.map(async (file) => {
    const content = await readFile(file.path)

    return {
      ...file,
      path: file.path.replace(process.cwd(), '.'),
      code: content.toString(),
    }
  })

  return await Promise.all(readContents)
}

module.exports = readFileCode
