const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const PasswordHelper = require('./../helpers/passwordHelper')
const USER = {
    username: 'teste',
    password: '123456'
}
const Jwt = require('jsonwebtoken')

class AuthRoutes extends BaseRoute {
    constructor(key, db) {
        super()
        this.secret = key
        this.db = db
    }

    login() {

        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Logar na Aplicação',
                notes: 'Retorna o TOKEN necessário para acessar as demais rotas',
                validate: {
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                const {
                    username,
                    password
                } = request.payload

                const [user] = await this.db.read({
                    username: username.toLowerCase()
                })

                if (!user) {
                    return Boom.unauthorized('O usuário informado não existe na base.')
                }

                const match = await PasswordHelper.comparePassword(password, user.password)

                if (!match) {
                    return Boom.unauthorized('Usuário e/ou senha são inválidos!')
                }

                return {
                    token: Jwt.sign({
                        username: username
                    }, this.secret)
                }
            }
        }
    }
}
module.exports = AuthRoutes