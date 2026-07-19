import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';

describe('Crypto Endpoints', () => {
    jest.setTimeout(15000);
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/assetmatrix_test');
        }
    });

    afterAll(async () => {
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
    });

    it('Debería rechazar un tipo de transacción inválido', async () => {
        const res = await request(app)
            .post('/api/v1/crypto/transaction')
            .send({
                coinId: 'ethereum',
                type: 'HOLD', // Inválido según Joi
                amount: 2.5,
                priceAtTransaction: 2500
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toContain('BUY o SELL');
    });

    
    
});