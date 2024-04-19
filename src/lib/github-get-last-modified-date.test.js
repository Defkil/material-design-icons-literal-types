const https = require('https')
const githubGetLastModifiedDate = require('./github-get-last-modified-date')

jest.mock('https')

describe('githubGetLastModifiedDate', () => {
  const mockHttpsGet = (data, statusCode = 200) => {
    https.get.mockImplementation((options, callback) => {
      const response = {
        statusCode,
        on: jest.fn((event, handler) => {
          if (event === 'data') handler(JSON.stringify(data))
          if (event === 'end') handler()
        })
      }
      callback(response)
      return {
        on: jest.fn()
      }
    })
  }

  test('should return the last modified date when the request is successful', async () => {
    const commitsData = [{
      commit: {
        committer: {
          date: '2023-01-01T00:00:00Z'
        }
      }
    }]
    mockHttpsGet(commitsData)

    const lastModifiedDate = await githubGetLastModifiedDate('path/to/file')
    expect(lastModifiedDate).toEqual('2023-01-01T00:00:00Z')
  })

  test('should throw an error when the API returns a non-200 status code', async () => {
    mockHttpsGet({}, 404)
    await expect(githubGetLastModifiedDate('path/to/file'))
      .rejects.toThrow('GitHub API request failed with status code 404.')
  })

  test('should throw an error when no commits are found', async () => {
    mockHttpsGet([])
    await expect(githubGetLastModifiedDate('path/to/file'))
      .rejects.toThrow('No commits found for the specified file.')
  })

  test('should handle network errors gracefully', async () => {
    https.get.mockImplementation((options, callback) => {
      return {
        on: (event, handler) => {
          if (event === 'error') handler(new Error('Network error'))
        }
      }
    })

    await expect(githubGetLastModifiedDate('path/to/file'))
      .rejects.toThrow('Network error')
  })
})
