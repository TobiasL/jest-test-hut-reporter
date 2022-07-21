const fs = require('fs/promises')

const COLLECTION_PATH = './temp_images.json'

const saveImage = async (imageData) => {
  const data = `${JSON.stringify(imageData)}\n`

  await fs.appendFile(COLLECTION_PATH, data)
}

const getImageCollection = async () => {
  try {
    const imageCollection = await fs.readFile(COLLECTION_PATH)

    const images = imageCollection.toString().split('\n').filter((line) => line).map(JSON.parse)

    await fs.rm(COLLECTION_PATH)

    return images
  } catch (error) {
    return []
  }
}

module.exports = {
  saveImage,
  getImageCollection,
}
