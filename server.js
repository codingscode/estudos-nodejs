const http = require('http')

http.createServer((req, res) => {
    res.end('Hello world!')
}).listen(4000, () => {
    console.log('Server working.')
})