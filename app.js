const http = require('http')

const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('in the Middleware');
    next();
});

app.use((req, res, next) =>{
    console.log('In another Middlewawre')
});

const server = http.createServer(app);

server.listen(3000);