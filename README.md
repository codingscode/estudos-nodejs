# Estudos Node.js

Acesse em: (https://estudos-nodejs.herokuapp.com/documentation)
Para ver estatísticas de teste: (https://estudos-nodejs.herokuapp.com/coverage)

Nessa simples aplicação foram trabalhados os conceitos de multi banco de dados e o padrão strategy.

- Autenticação: JWT
- Mensagens de Erro Amigáveis e Padronizadas: Boom
- Design Patterns: Strategy
- Multi-Banco de Dados (SQL e NoSQL): PostgreSQL usando Sequelize e MongoDB com Mongoose
- Servidor HTTP: Hapi.js
- Validação dos Objetos: Joi
- Testes: Mocha
- Cobertura de Código: Istanbul
- Documentação: Swagger /documentation
- Publicação do Serviço: Heroku

## Como usar

Criar bancos no Docker:
```shell
docker run --name projeto-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=herois -p 5432:5432 -d postgres
```

```shell
docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin -d mongo

```

Instalar as dependências:
```shell
npm i
```

Rodar o projeto:
```shell
npm start
```

Rodar os testes:
```shell
npm test
```

Made with :heart: by Maily Santos [Linkedin](https://www.linkedin.com/in/mailysantos/)
