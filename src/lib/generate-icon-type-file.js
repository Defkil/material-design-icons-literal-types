const fs = require('fs').promises
const https = require('https')

/**
 * @param {Object} options - Options
 * @param {string} options.githubPath - URL to download
 * @param {string} options.outputTypeName - Name of the output type
 * @param {string} options.outputFile - Output file path
 * @return {Promise<void>}
 */
module.exports = async function generateIconTypeFile (options) {
  const typeContent = await downloadAndProcess(options.githubPath)
  await fs.writeFile(options.outputFile, `export type ${options.outputTypeName} =\n${typeContent};`)
}

/**
 * Download and process the content of the given URL
 * @param {string} githubPath - path to download
 * @return {Promise<string>} - Processed content
 */
async function downloadAndProcess (githubPath) {
  const options = {
    hostname: 'raw.githubusercontent.com',
    path: '/google/material-design-icons/master/' + githubPath,
    headers: {
      'User-Agent': 'Node.js'
    }
  }
  return new Promise((resolve, reject) => {
    let formattedNames = []

    https.get(options, (response) => {
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
