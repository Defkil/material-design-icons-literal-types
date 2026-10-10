const generateTypeFile = require('./lib/generate-type-file')
const readDataSource = require('./lib/load-data-source')
const fs = require('fs')

async function main () {
  const distDir = 'dist'
  await fs.promises.mkdir(distDir, { recursive: true })

  for (const { githubPath, outputFile, outputTypeName } of await readDataSource()) {
    await generateTypeFile({
      githubPath,
      outputFile: distDir + '/' + outputFile,
      outputTypeName
    })
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
