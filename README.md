# Jest Test Hut reporter

*Jest Reporter for uploading test runs to Test Hut.*


*https://test-hut.tobiaslindstrom.se/*

## API

### Installation and Jest configuration

Install:

`npm install --save-dev jest-test-hut-reporter`

Configuration in `package.json`:

```json
{
  "jest": {
    "reporters": ["default", "jest-test-hut-reporter"]
  }
}
```

### Add image to be viewable in Test Hut

Use the function `addImage` to add images to be viewable in Test Hut.
It will automatically be connected to the file and line number the function is run at.

```javascript
const { addImage } = require('jest-test-hut-reporter')

it('Test', async () => {
  const base64Image = await screenshotApp()

  await addImage(base64Image)
})
```

### Jest --testLocationInResults

Run Jest with the argument `--testLocationInResults` to get line numbers for the test cases.

## Environment variables

### Required

* `TEST_HUT_KEY` API key for the project shown in Test Hut.

### Optional

* `TEST_INGESTER_URL` Used to override the URL to send the test runs to.
