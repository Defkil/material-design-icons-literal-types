const https = require('https')

/**
 * Get the last modified date of a file in the Google Material Design Icons repository on GitHub.
 * @param {string} filePath - The path to the file in the repository.
 * @return {Promise<Date>} - The last modified date of the file.
 */
module.exports = async function githubGetLastModifiedDate (filePath) {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/google/material-design-icons/commits?path=${filePath}&page=1&per_page=1`,
    headers: {
      'User-Agent': 'Node.js'
    }
  }

  return new Promise((resolve, reject) => {
    const request = https.get(options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`GitHub API request failed with status code ${response.statusCode}.`))
        return
      }

      let data = ''

      response.on('data', (chunk) => {
        data += chunk
      })

      response.on('end', () => {
        const commits = JSON.parse(data)

        if (commits.length === 0) {
          reject(new Error('No commits found for the specified file.'))
          return
        }

        const lastModifiedDate = commits[0].commit.committer.date
        resolve(new Date(lastModifiedDate))
      })
    })

    request.on('error', (error) => {
      reject(error)
    })
  })
}
