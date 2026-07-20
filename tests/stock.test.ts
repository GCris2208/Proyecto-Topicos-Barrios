import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

describe('Stock Endpoints', () => {
    jest.setTimeout(15000);
    
    let createdAlertId: string;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/assetmatrix_test');
        }
    });

    afterAll(async () => {
        if (mongoose.connection.db) {
             await mongoose.connection.collection('stockwatches').deleteMany({});
        }
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
        
        createdAlertId = res.body.data._id;
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

    // --- NUEVAS PRUEBAS: GET y DELETE ---
    it('Debería consultar el historial de tendencias', async () => {
        const res = await request(app).get('/api/v1/stocks/history');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
    });

    it('Debería consultar el estado actual de una acción', async () => {
        const res = await request(app).get('/api/v1/stocks/TSLA');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('currentMarketPrice');
    });

    it('Debería eliminar la alerta de precio de forma atómica', async () => {
        const res = await request(app).delete(`/api/v1/stocks/${createdAlertId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('eliminada');
    });
    
    it('Debería retornar 404 si se intenta eliminar una alerta inexistente', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/v1/stocks/${fakeId}`);
        expect(res.statusCode).toEqual(404);
    });
});