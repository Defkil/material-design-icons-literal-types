const fs = require('fs').promises
const https = require('https')
const generateIconTypeFile = require('./generate-icon-type-file')

describe('generateIconTypeFile', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    fs.unlink('icons.ts').catch(() => {})
  })

  it('should generate the icon type file correctly', async () => {
    const options = {
      url: 'https://example.com/icons',
      outputTypeName: 'IconType',
      outputFile: 'icons.ts',
    }

    const httpsGetSpy = jest.spyOn(https, 'get').mockImplementation((url, callback) => {
      const response = {
        on: jest.fn((event, handler) => {
          if (event === 'data') {
            handler('icon1 e000\nicon2 e000\nicon3 e000\n')
          } else if (event === 'end') {
            handler()
          }
        }),
      }
      callback(response)
      return {
        on: jest.fn((event, handler) => {
          if (event === 'error') {
            handler(new Error('Download error'))
          }
        }),
      }
    })

    const fsWriteFileSpy = jest.spyOn(fs, 'writeFile')

    await generateIconTypeFile(options)

    expect(httpsGetSpy).toHaveBeenCalledWith('https://example.com/icons', expect.any(Function))
    expect(fsWriteFileSpy).toHaveBeenCalledWith(
      'icons.ts',
      `export type IconType =
| 'icon1'
| 'icon2'
| 'icon3';`
    )
  })

  it('should handle download errors', async () => {
    const options = {
      url: 'https://example.com/icons',
      outputTypeName: 'IconType',
      outputFile: 'icons.ts',
    }

    jest.spyOn(https, 'get').mockImplementation((url, callback) => {
      const response = {
        on: jest.fn(),
      }
      callback(response)
      return {
        on: jest.fn((event, handler) => {
          if (event === 'error') {
            handler(new Error('Download error'))
          }
        }),
      }
    })

    await expect(generateIconTypeFile(options)).rejects.toThrow('Download error')
  })
})
