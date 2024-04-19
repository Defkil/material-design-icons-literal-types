const fs = require('fs').promises
const readDataSource = require('./load-data-source')

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}))

describe('readDataSource', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should read and parse data source file correctly', async () => {
    const mockData = [{ outputFile: 'output.txt', outputTypeName: 'OutputType', githubPath: 'path/to/file' }]
    fs.readFile.mockResolvedValue(JSON.stringify(mockData))

    const result = await readDataSource()

    expect(fs.readFile).toHaveBeenCalledWith('./src/data-source.json', 'utf8')
    expect(result).toEqual(mockData)
  })

  it('should throw an error if reading data source file fails', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    const mockError = new Error('Read file error')
    fs.readFile.mockRejectedValue(mockError)

    await expect(readDataSource()).rejects.toThrow(mockError)
    expect(fs.readFile).toHaveBeenCalledWith('./src/data-source.json', 'utf8')
    expect(errorSpy).toHaveBeenCalledWith('Error reading data source:', mockError)
  })
})
