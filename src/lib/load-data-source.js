const fs = require('fs').promises

/**
 * @typedef {Object} FileConfig
 * Represents the configuration for the data source file.
 * @property {string} outputFile - The name of the generated output file.
 * @property {string} outputTypeName - The typescript type name to be used for the output.
 * @property {string} githubPath - The path to the file configuration.
 */

/**
 * Reads the JSON data from the file located at './src/data-source.json'.
 * @returns {Promise<Array<FileConfig>>} A promise that resolves with an array of FileConfig objects.
 */
module.exports = async function readDataSource () {
  try {
    const data = await fs.readFile('./src/data-source.json', 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading data source:', error)
    throw error
  }
}
