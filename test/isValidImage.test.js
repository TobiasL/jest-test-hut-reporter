const fs = require('fs')

const isValidImage = require('../src/isValidImage')

const imageInPNG = fs.readFileSync('./test/example-image.png', { encoding: 'base64' })
const imageInBinaryPNG = fs.readFileSync('./test/example-image.png', { encoding: 'binary' })
const imageInJPG = fs.readFileSync('./test/example-image.jpg', { encoding: 'base64' })

it('Accept PNG image in Base64', () => {
  expect(isValidImage(imageInPNG)).toBeTruthy()
})

it('Reject image not in Base64', () => {
  expect(isValidImage(imageInBinaryPNG)).toBeFalsy()
})

it('Reject image not in PNG', () => {
  expect(isValidImage(imageInJPG)).toBeFalsy()
})
