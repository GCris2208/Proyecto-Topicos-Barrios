import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

describe('Crypto Endpoints', () => {
    jest.setTimeout(15000);
    
    let createdTxId: string; 

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/assetmatrix_test');
        }
    });

    afterAll(async () => {
        if (mongoose.connection.db) {
             await mongoose.connection.collection('cryptotransactions').deleteMany({});
        }
        await mongoose.connection.close();
    });

    it('Debería registrar una transacción criptográfica', async () => {
        const res = await request(app)
            .post('/api/v1/crypto/transaction')
            .send({
                coinId: 'ethereum',
                type: 'BUY',
                amount: 2.5,
                priceAtTransaction: 2500
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.data.coinId).toEqual('ethereum');
        
        createdTxId = res.body.data._id; 
    });

    it('Debería rechazar un tipo de transacción inválido', async () => {
        const res = await request(app)
            .post('/api/v1/crypto/transaction')
            .send({
                coinId: 'ethereum',
                type: 'HOLD',
                amount: 2.5,
                priceAtTransaction: 2500
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.detalles[0].mensaje).toContain('BUY o SELL');
    });

    // --- NUEVAS PRUEBAS: GET y DELETE ---
    it('Debería consultar los datos de mercado de una criptomoneda', async () => {
        const res = await request(app).get('/api/v1/crypto/ethereum');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('currentPriceUsd');
    });

    it('Debería consultar el valor del portafolio', async () => {
        const res = await request(app).get('/api/v1/crypto/ethereum/portfolio');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('totalValueUsd');
    });

    it('Debería revertir el registro de transacción de forma directa', async () => {
        const res = await request(app).delete(`/api/v1/crypto/${createdTxId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('revertido');
    });

    it('Debería retornar 404 si se intenta eliminar una transacción inexistente', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/v1/crypto/${fakeId}`);
        expect(res.statusCode).toEqual(404);
    });
});