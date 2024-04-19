const fs = require('fs')
const { packageConfigLastGeneratedGet, packageConfigLastGeneratedSet } = require('./package-config-last-generated')
jest.mock('fs')

describe('packageConfigLastGenerated', () => {
  beforeEach(() => {
    const examplePackageJson = {
      config: {
        lastGenerated: '2021-01-01T00:00:00.000Z'
      }
    }
    fs.readFileSync.mockReturnValue(JSON.stringify(examplePackageJson))
    fs.writeFileSync.mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should correctly get the last generated timestamp', () => {
    const timestamp = packageConfigLastGeneratedGet()
    expect(timestamp).toBe('2021-01-01T00:00:00.000Z')
    expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('package.json'), 'utf8')
  })

  test('should throw an error if config object is missing', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify({}))
    expect(packageConfigLastGeneratedGet).toThrow('No config object in package.json')
  })

  test('should throw an error if lastGenerated property is missing', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify({ config: {} }))
    expect(packageConfigLastGeneratedGet).toThrow('No lastGenerated property in package.json config')
  })

  test('should correctly set the last generated timestamp', () => {
    const newTime = new Date(2022, 0, 1)
    packageConfigLastGeneratedSet(newTime)
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
      expect.stringContaining(newTime.toISOString()),
      'utf8'
    )
  })
})
