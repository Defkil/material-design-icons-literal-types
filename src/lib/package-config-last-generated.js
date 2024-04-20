const fs = require('fs')
const path = require('path')

const packageJsonPath = path.join(__dirname, '../../package.json')

/**
 * Get the last generated timestamp from the package.json file
 * @return {Date} - The last generated timestamp
 */
function packageConfigLastGeneratedGet () {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  if (!packageJson.config) {
    throw new Error('No config object in package.json')
  }
  if (!packageJson.config.lastGenerated) {
    throw new Error('No lastGenerated property in package.json config')
  }
  return new Date(packageJson.config.lastGenerated)
}

/**
 * Set the last generated timestamp in the package.json file
 * @param {Date} time - The time to set as the last generated timestamp
 */
function packageConfigLastGeneratedSet (time) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  packageJson.config = packageJson.config || {}
  packageJson.config.lastGenerated = time.toISOString()
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8')
}

module.exports = {
  packageConfigLastGeneratedGet, packageConfigLastGeneratedSet
}
