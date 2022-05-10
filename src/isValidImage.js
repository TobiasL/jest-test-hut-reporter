const isValidImage = (imageBuffer) => {
  const byteBuffer = Buffer.from(imageBuffer, 'base64')
  const isBase64 = byteBuffer.toString('base64') === imageBuffer
  const isPNG = byteBuffer[0] === 0x89 && byteBuffer[1] === 0x50

  return isBase64 && isPNG
}

module.exports = isValidImage
