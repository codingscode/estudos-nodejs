const { join } = require('path')
const { config } = require('dotenv')
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "Environment inválida! (prod ou dev)")

const configPath = join('./config', `.env.${env}`)

config({ path: configPath })

const Hapi = require('hapi')
const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDB = require('./src/db/strategies/mongodb/mongoDbStrategy')

const HeroiRoutes = require('./src/routes/heroiRoutes')
const HeroiSchema = require('./src/db/strategies/mongodb/schemas/heroiSchema')

const PostgresDB = require('./src/db/strategies/postgres/postgresSQLStrategy')
const AuthRoutes = require('./src/routes/authRoutes')

const UserRoutes = require('./src/routes/userRoutes')
const UserSchema = require('./src/db/strategies/postgres/schemas/userSchema')

const UtilRoutes = require('./src/routes/utilRoutes')

const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')
const HapiJwt = require('hapi-auth-jwt2')
const MINHA_CHAVE_SECRETA = process.env.JWT_KEY

const swaggerConfig = {
    info: {
        title: 'API Herois',
        version: 'v1.0'
    },
    lang: 'pt'
}

const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    try{
        const connectionPostgres = await PostgresDB.connect()
        const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
        const postgresModel = new Context(new PostgresDB(connectionPostgres, model));
    
        const connection = MongoDB.connect()
        const mongoDb = new Context(new MongoDB(connection, HeroiSchema))
    
    
        await app.register([
            HapiJwt,
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: swaggerConfig
            }
        ])
        app.auth.strategy('jwt', 'jwt', {
            key: MINHA_CHAVE_SECRETA,
    
            validate: (dado, request) => {
                return {
                    isValid: true
                }
            }
        })
    
        app.auth.default('jwt')
    
        app.route([
            ...mapRoutes(new UtilRoutes(), UtilRoutes.methods()),
            ...mapRoutes(new HeroiRoutes(mongoDb), HeroiRoutes.methods()),
            ...mapRoutes(new AuthRoutes(MINHA_CHAVE_SECRETA, postgresModel), AuthRoutes.methods()),
            ...mapRoutes(new UserRoutes(postgresModel), UserRoutes.methods())
        ])
    
        await app.start()
        console.log('Server Running at: ', app.info.port)
    
        return app;
    } catch (error) {
        return error;
    }
}
module.exports = main()