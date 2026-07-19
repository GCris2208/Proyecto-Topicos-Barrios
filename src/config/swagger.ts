import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AssetMatrix - Financial Intelligence API',
            version: '1.0.0',
            description: 'API REST para el Monitoreo Global de Activos Bursátiles y Criptográficos',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Servidor Local',
            },
        ],
        components: {
            schemas: {
                StockAlert: {
                    type: 'object',
                    required: ['symbol', 'alertPrice'],
                    properties: {
                        symbol: { type: 'string', example: 'AAPL' },
                        alertPrice: { type: 'number', example: 150.5 },
                    },
                },
                CryptoTransaction: {
                    type: 'object',
                    required: ['coinId', 'type', 'amount', 'priceAtTransaction'],
                    properties: {
                        coinId: { type: 'string', example: 'bitcoin' },
                        type: { type: 'string', enum: ['BUY', 'SELL'], example: 'BUY' },
                        amount: { type: 'number', example: 0.5 },
                        priceAtTransaction: { type: 'number', example: 65000 },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'], // Asegúrate de que tus rutas tengan comentarios JSDoc si quieres expandir esto
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Documentación disponible en http://localhost:3000/api-docs');
};