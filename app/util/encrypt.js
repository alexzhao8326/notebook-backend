const { createHash } = require('crypto')

const encrypt = (algorithm, content) => {
    let hash = createHash(algorithm)
    hash.update(content)
    return hash.digest('hex')
}
module.exports = encrypt
