const fs = require('fs').promises
const https = require('https')

/**
 * @param {Object} options - Options
 * @param {string} options.url - URL to download
 * @param {string} options.outputTypeName - Name of the output type
 * @param {string} options.outputFile - Output file path
 * @return {Promise<void>}
 */
module.exports = async function generateIconTypeFile (options) {
  const typeContent = await downloadAndProcess(options.url)
  await fs.writeFile(options.outputFile, `export type ${options.outputTypeName} =\n${typeContent};`)
}

/**
 * Download and process the content of the given URL
 * @param {string} url - URL to download
 * @return {Promise<string>} - Processed content
 */
async function downloadAndProcess (url) {
  return new Promise((resolve, reject) => {
    let formattedNames = []

    https.get(url, (response) => {
      response.on('data', (chunk) => {
        const lines = chunk.toString().split('\n')
        const chunkNames = lines.map((line) => line.split(' ')[0])
        const chunkFormattedNames = formatNamesToLiteralTypes(chunkNames)
        formattedNames = formattedNames.concat(chunkFormattedNames)
      })

      response.on('end', () => {
        resolve(formattedNames.join('\n'))
      })
    }).on('error', (error) => {
      reject(error)
    })
  })
}

/**
 *
 * @param {string[]} names - Material Design Source Names
 * @return {string[]} - Formatted names as literal types
 */
function formatNamesToLiteralTypes (names) {
  return names.filter(name => name.trim() !== '').map((name) => `| '${name}'`)
}
