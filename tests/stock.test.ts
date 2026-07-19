import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

describe('Stock Endpoints', () => {
    jest.setTimeout(15000);
    beforeAll(async () => {
        // Conexión a una base de datos de prueba si es necesario, aquí usamos la de desarrollo
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/assetmatrix_test');
        }
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('Debería crear una nueva alerta bursátil', async () => {
        const res = await request(app)
            .post('/api/v1/stocks')
            .send({
                symbol: 'TSLA',
                alertPrice: 200
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Alerta bursátil creada exitosamente');
        expect(res.body.data.symbol).toEqual('TSLA');
    });

    it('Debería fallar si el precio de alerta es negativo', async () => {
        const res = await request(app)
            .post('/api/v1/stocks')
            .send({
                symbol: 'TSLA',
                alertPrice: -50
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    
});