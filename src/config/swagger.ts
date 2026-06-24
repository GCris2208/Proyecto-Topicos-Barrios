import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Chistes - Tópicos Especiales',
            version: '1.0.0',
            description: 'Documentación de la API REST para gestión de chistes.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local',
            },
        ],
    },
    // Le decimos a Swagger dónde buscar los comentarios de documentación
    apis: ['./src/routes/*.ts', './src/models/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;