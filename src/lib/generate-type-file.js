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
  const sourceContent = await downloadContent(options.githubPath)
  const processedContent = processContent(sourceContent)
  const typeContent = generateTypeContent(options.outputTypeName, processedContent)

  validateGeneratedContent(sourceContent, typeContent)

  await writeTypeFile(options.outputFile, typeContent)
}

async function downloadContent (githubPath) {
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
      response.on('data', (chunk) => { data += chunk })
      response.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

function processContent (sourceContent) {
  return sourceContent
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      const iconName = line.split(/\s+/)[0].trim()
      return `| '${iconName}'`
    })
    .join('\n')
}

function generateTypeContent (outputTypeName, processedContent) {
  return `export type ${outputTypeName} =\n${processedContent};`
}

function validateGeneratedContent (sourceContent, typeContent) {
  const sourceLines = sourceContent.split('\n').filter(line => line.trim() !== '').length
  const generatedLines = typeContent.split('\n').length

  if (generatedLines !== sourceLines + 1) {
    throw new Error(`Generated file has ${generatedLines} lines, expected ${sourceLines + 1} lines`)
  }
}

async function writeTypeFile (outputFile, typeContent) {
  await fs.writeFile(outputFile, typeContent)
}
