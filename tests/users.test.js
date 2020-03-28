const assert = require('assert')
const api = require('../api')
const Context = require('./../src/db/strategies/base/contextStrategy')
const PostgresDB = require('./../src/db/strategies/postgres/postgresSQLStrategy')
const UserSchema = require('./../src/db/strategies/postgres/schemas/userSchema')

let app = {}
let MOCK_ID = ""
let MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlIiwiaWF0IjoxNTg0OTY5NDkyfQ.YAZXEn8HGsYVWicJfWWi-dwVIdHkifHMIDpx4lVgP38"
const headers = {
    Authorization: MOCK_TOKEN
}

const USER = {
    username: 'rachel',
    password: '123456'
}

const USER_DB = {
    ...USER,
    password: '$2b$04$5AzCaAbujScJuV4L1ocmLukhNuoHQ.MFva7C1/MNJQAhbGD5XjpaO'
}

describe('Users test suite', function () {
    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await PostgresDB.connect()
        const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
        const postgresModel = new Context(new PostgresDB(connectionPostgres, model));
        await postgresModel.update(null, USER_DB, true)
    })

    it('não deve listar usuário sem um token', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/user',
        })
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(JSON.parse(result.payload).error, "Unauthorized")
    })

    it('listar /user', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/user',
            headers
        })
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(JSON.parse(result.payload)))
    })

    it('cadastrar /user', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/user',
            payload: {
                username: 'phoebe',
                password: '123456'
            }
        });

        MOCK_ID = JSON.parse(result.payload).id
        assert.deepEqual(result.statusCode, 200)
        assert.deepEqual(JSON.parse(result.payload).username, "phoebe")

    })

    it('não deve cadastrar com payload errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/user',
            headers,
            payload: {
                username: 'temp'
            }
        })
        const payload = JSON.parse(result.payload)
        assert.deepEqual(result.statusCode, 400)
        assert.ok(payload.message.search('"password" is required') !== -1)
    })

    it('atualizar /user/{id}', async () => {
        const result = await app.inject({
            method: 'PATCH',
            url: `/user/${MOCK_ID}`,
            headers,
            payload: {
                password: '123456789'
            }
        })

        assert.deepEqual(result.statusCode, 200)
        assert.deepEqual(JSON.parse(result.payload)[0], 1)

    })
    it('remover /user/{id}', async () => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/user/${MOCK_ID}`,
            headers,
        })

        assert.deepEqual(result.statusCode, 200)
        assert.deepEqual(JSON.parse(result.payload), 1)
    })
})