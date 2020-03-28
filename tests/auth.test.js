const assert = require('assert')
const api = require('../api')
const Context = require('./../src/db/strategies/base/contextStrategy')
const PostgresDB = require('./../src/db/strategies/postgres/postgresSQLStrategy')
const UserSchema = require('./../src/db/strategies/postgres/schemas/userSchema')

let app = {}
const USER = {
    username: 'teste',
    password: '123456'
}

const USER_DB = {
    ...USER,
    password: '$2b$04$5AzCaAbujScJuV4L1ocmLukhNuoHQ.MFva7C1/MNJQAhbGD5XjpaO'
}


describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await PostgresDB.connect()
        const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
        const postgresModel = new Context(new PostgresDB(connectionPostgres, model));
        await postgresModel.update(null, USER_DB, true)
    })
    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(JSON.parse(result.payload).token.length > 10)
    })

    it('deve retornar não autorizado ao tentar obter um token com login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'mailysantos',
                password: '123'
            }
        });
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(JSON.parse(result.payload).error, "Unauthorized")
    })
})