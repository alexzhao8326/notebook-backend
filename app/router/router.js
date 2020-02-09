const Router = require('koa-router')
const SignUpController = require('../controller/signUp')
const router = new Router()
module.exports = app => {
    // get viliate code
    router.post('/email-vilidate-code', SignUpController.getVilidateCode)
    // sign up
    router.post('/signup', SignUpController.signUp)

    app.use(router.routes())
       .use(router.allowedMethods())
}
