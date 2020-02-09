const redis = require('redis')
const redisConfig = require('../config/redis-config')
const client = redis.createClient(redisConfig.port, redisConfig.url)

// handle connection error
client.on('error', err => {
    console.log('resid connect err', err)
})

// connect success
client.on('connect', () => {
    console.log('redis connect successful')
})

const redisOp = {
    setString: (key, value, expire) => {
        return new Promise((resolve, reject) => {
            client.set(key, value, (err, res) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                if (!isNaN(expire) && expire > 0) {
                    client.expire(key, parseInt(expire))
                }
                resolve(res)
            })
        })
    },
    getString: key => {
        return new Promise((resolve, reject) => {
            client.get(key, (err, res) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(res)
            })
        })
    }
}
module.exports = redisOp
