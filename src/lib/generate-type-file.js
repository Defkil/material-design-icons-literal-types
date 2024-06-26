const fs = require('fs').promises
const https = require('https')

/**
 * @param {Object} options - Options
 * @param {string} options.githubPath - URL to download
 * @param {string} options.outputTypeName - Name of the output type
 * @param {string} options.outputFile - Output file path
 * @return {Promise<void>}
 */
module.exports = async function generateTypeFile (options) {
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
    let data = ''

    https.get(options, (response) => {
      response.on('data', (chunk) => {
        data += chunk
      })

      response.on('end', () => {
        const formattedNames = formatNamesToLiteralTypes(data.split('\n'))
        resolve(formattedNames.join('\n'))
      })
    }).on('error', (error) => {
      reject(error)
    })
  })
}

/**
 * @param {string[]} lines - Lines from the downloaded file
 * @return {string[]} - Formatted names as literal types
 */
function formatNamesToLiteralTypes (lines) {
  return lines
    .filter(line => line.trim() !== '')
    .map((line) => {
      const iconName = line.split(/\s+/)[0].trim()
      return `| '${iconName}'`
    })
}
