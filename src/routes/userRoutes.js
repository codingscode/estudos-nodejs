const BaseRoute = require('./base/baseRoute')
const PasswordHelper = require('./../helpers/passwordHelper');
const Joi = require('joi')

class UserRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/user',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'listar usuários',
                notes: 'retorna a base inteira de usuários',
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown()
                }
            },
            handler: (request, headers) => {
                return this.db.read()
            }
        }
    }
    create() {
        return {
            path: '/user',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'cadastrar usuários',
                notes: 'Cadastra um usuário',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    payload: {
                        username: Joi.string().max(30).required(),
                        password: Joi.string().max(100).required()
                    }
                },

            },
            handler: async (request, headers) => {
                const {
                    username,
                    password
                } = request.payload

                const hash = await PasswordHelper.hashPassword(password);
                return this.db.create({ username: username, password: hash })
            }
        }
    }
    update() {
        return {
            path: '/user/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'atualizar password',
                notes: 'atualiza um user por ID',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        password: Joi.string().max(30)
                    }
                },

            },
            handler: async (request, headers) => {
                const {
                    password
                } = request.payload

                const hash = await PasswordHelper.hashPassword(password);
                const id = request.params.id;
                return this.db.update(id, { password: hash })
            }
        }
    }
    delete() {
        return {
            path: '/user/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'remover user',
                notes: 'remove um user por id',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: (request, headers) => {
                const id = request.params.id;
                return this.db.delete(id)
            }
        }
    }

}

module.exports = UserRoutes