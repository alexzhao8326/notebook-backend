const nodemailer = require('nodemailer')
const redisOp = require('../util/redis')
const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
const User = require('../model/user')
const encrypt = require('../util/encrypt')
const signUp = {
    getVilidateCode: async (ctx, next) => {
        let { email } = ctx.request.body
        if (pattern.test(email)) {
            let user = await User.findAll({
                where:{
                    account:email
                }
            })
            if(user){
                ctx.body = {
                    isSuccess:false,
                    data:null,
                    errorMsg:'该邮箱已被注册'
                }
                return 
            }
            async function sendMail() {
                let transporter = nodemailer.createTransport({
                    host: 'smtp.office365.com',
                    port: '587',
                    secure: false,
                    auth: {
                        user: 'alex.zhao8326@outlook.com',
                        pass: 'Zhaolei1990@'
                    }
                })
                // generate random code between 1000 and 9999
                let code = Math.round(Math.random() * (9999 - 1000) + 1000)
                // email options
                let mailOptions = {
                    from: 'alex.zhao8326@outlook.com',
                    to: email,
                    subject: '欢迎注册Notebook',
                    text: '1234',
                    html: `<p>您的验证码为<strong>${code}</strong>，3分钟之内有效</p>`
                }
                ctx.body = {
                    isSuccess: true,
                    data: null,
                    errorMsg: ''
                }
                // send emial
                let info = await transporter.sendMail(mailOptions)
                // store vilidate code in redis
                let ret = await redisOp.setString(email, code, 60 * 3)
            }
            sendMail().catch(err => {
                console.log('err', err)
            })
        } else {
            ctx.body = {
                isSuccess: false,
                data: null,
                errorMsg: '邮箱格式不正确'
            }
        }
    },
    signUp: async (ctx, next) => {
        let { account, password, vilidateCode } = ctx.request.body
        if (!pattern.test(account)) {
            ctx.body = {
                isSuccess: false,
                data: null,
                errorMsg: '邮箱格式不正确'
            }
        }
        if (password.length > 20) {
            ctx.body = {
                isSuccess: false,
                data: null,
                errorMsg: '密码超出规定长度'
            }
            return false
        }
        if (password.length < 6) {
            ctx.body = {
                isSuccess: false,
                data: null,
                errorMsg: '密码长度过短'
            }
        }
        let patternArr = [/[A-Z]+/, /[a-z]+/, /\d+/]
        let errMsg = ''
        for (let i = 0; i < 3; i++) {
            if (!patternArr[i].test(password)) {
                switch (i) {
                    case 0:
                        errMsg = '至少包含一个大写字母'
                        break
                    case 1:
                        errMsg = '至少包含一个小写字母'
                        break
                    case 2:
                        errMsg = '至少包含一个数字'
                        break
                }
                break
            }
        }
        if (errMsg) {
            ctx.body = {
                isSuccess: false,
                data: null,
                errorMsg: errMsg
            }
        } else {
            let $vilidateCode = await redisOp.getString(account)
            if (vilidateCode === $vilidateCode) {
                let ret = await User.sync()
                ret = await User.create({
                    account,
                    password: encrypt('md5', password)
                })
                ctx.body = {
                    isSuccess: true,
                    data: null,
                    errorMsg: ''
                }
            } else {
                ctx.body = {
                    isSuccess: false,
                    data: null,
                    errorMsg: '验证码错误'
                }
            }
        }
    }
}
module.exports = signUp
