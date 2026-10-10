const neostandard = require('neostandard')

module.exports = neostandard({ env: ['jest'], ignores: neostandard.resolveIgnoresFromGitignore() })
