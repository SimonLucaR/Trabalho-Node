const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    info: {
        title: 'Titulo da documentação',
        version: '1.0.0',
        description: 'Descrição simples da documentação'
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: [
        "http"
    ]
};

const options = {
    swaggerDefinition,
    apis: [
        './api/docs/**/*.yaml'
    ],
}

module.exports = swaggerJSDoc(options);