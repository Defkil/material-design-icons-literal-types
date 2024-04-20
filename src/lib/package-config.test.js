const fs = require('fs')
const { packageConfigGetLastGenerated, packageConfigSetAndIncrementVersion } = require('./package-config')
jest.mock('fs')

describe('packageConfig', () => {
  beforeEach(() => {
    const examplePackageJson = {
      version: '1.0.0',
      config: {
        lastGenerated: '2021-01-01T00:00:00.000Z'
      }
    }
    fs.readFileSync.mockImplementation(() => JSON.stringify(examplePackageJson))
    fs.writeFileSync.mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should correctly get the last generated timestamp', () => {
    const timestamp = packageConfigGetLastGenerated()
    expect(timestamp).toStrictEqual(new Date('2021-01-01T00:00:00.000Z'))
    expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('package.json'), 'utf8')
  })

  test('should throw an error if config object is missing', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify({}))
    expect(packageConfigGetLastGenerated).toThrow('No config object in package.json')
  })

  test('should throw an error if lastGenerated property is missing', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify({ config: {} }))
    expect(packageConfigGetLastGenerated).toThrow('No lastGenerated property in package.json config')
  })

  test('should correctly set the last generated timestamp', () => {
    const newTime = new Date(2022, 0, 1)
    packageConfigSetAndIncrementVersion(newTime)
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
      expect.stringContaining(newTime.toISOString()),
      'utf8'
    )
  })

  test('should correctly increment the version number', () => {
    const newTime = new Date(2022, 0, 1)
    const examplePackageJson = {
      version: '1.0.0'
    }
    fs.readFileSync.mockReturnValue(JSON.stringify(examplePackageJson))
    packageConfigSetAndIncrementVersion(newTime)
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
      expect.stringContaining('1.0.1'),
      'utf8'
    )
  })
})
