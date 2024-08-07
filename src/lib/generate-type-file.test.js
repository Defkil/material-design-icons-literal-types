const fs = require('fs').promises
const https = require('https')
const generateTypeFile = require('./generate-type-file')

describe('generateTypeFile', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    fs.unlink('icons.ts').catch(() => {})
  })

  it('should generate the icon type file correctly', async () => {
    const options = {
      githubPath: 'path/to/icons',
      outputTypeName: 'IconType',
      outputFile: 'icons.ts'
    }

    const dummyResponse = 'icon1 e000\nicon2 e000\nicon3 e000\n'
    jest.spyOn(https, 'get').mockImplementation((options, callback) => {
      const response = {
        on: (event, handler) => {
          if (event === 'data') {
            handler(Buffer.from(dummyResponse))
          }
          if (event === 'end') {
            handler()
          }
        }
      }
      callback(response)
      return { on: jest.fn() }
    })

    const writeFileSpy = jest.spyOn(fs, 'writeFile').mockResolvedValue()

    await generateTypeFile(options)

    expect(writeFileSpy).toHaveBeenCalledWith(
      'icons.ts',
      'export type IconType =\n| \'icon1\'\n| \'icon2\'\n| \'icon3\';'
    )
  })

  it('should handle download errors', async () => {
    const options = {
      url: 'https://example.com/icons',
      outputTypeName: 'IconType',
      outputFile: 'icons.ts'
    }

    jest.spyOn(https, 'get').mockImplementation((url, callback) => {
      const response = {
        on: jest.fn()
      }
      callback(response)
      return {
        on: jest.fn((event, handler) => {
          if (event === 'error') {
            handler(new Error('Download error'))
          }
        })
      }
    })

    await expect(generateTypeFile(options)).rejects.toThrow('Download error')
  })

  it('should throw an error when generated file has unexpected number of lines', async () => {
    const options = {
      githubPath: 'path/to/icons',
      outputTypeName: 'IconType',
      outputFile: 'icons.ts'
    }

    const dummyResponse = 'icon1 e000\nicon2 e000\n'
    jest.spyOn(https, 'get').mockImplementation((options, callback) => {
      const response = {
        on: (event, handler) => {
          if (event === 'data') {
            handler(Buffer.from(dummyResponse))
          }
          if (event === 'end') {
            handler()
          }
        }
      }
      callback(response)
      return { on: jest.fn() }
    })

    String.prototype.split = jest.fn().mockReturnValue(['line1', 'line2', 'line3']) // eslint-disable-line

    await expect(generateTypeFile(options)).rejects.toThrow('Generated file has 3 lines, expected 4 lines')
    jest.restoreAllMocks()
  })
})
