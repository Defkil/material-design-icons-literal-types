const generateTypeFile = require('./lib/generate-type-file')
const githubGetLastModifiedDate = require('./lib/github-get-last-modified-date')
const { packageConfigGetLastGenerated, packageConfigSetAndIncrementVersion } = require('./lib/package-config')
const readDataSource = require('./lib/load-data-source')
const fs = require('fs')

async function main () {
  const distDir = 'dist'
  const dataSource = await readDataSource()
  const lastGenerated = packageConfigGetLastGenerated()

  if (!fs.existsSync(distDir)) {
    await fs.promises.mkdir(distDir)
  }

  let modified = false
  for (const { githubPath, outputFile, outputTypeName } of dataSource) {
    const lastModifiedDate = await githubGetLastModifiedDate(githubPath)
    if (lastModifiedDate <= lastGenerated) {
      continue
    }
    await generateTypeFile({
      githubPath,
      outputFile: distDir + '/' + outputFile,
      outputTypeName
    })
    modified = true
  }
  if (modified) {
    packageConfigSetAndIncrementVersion(new Date())
  }
}

main().catch((error) => {
  console.error('Error:', error)
})
