import { Request, Response } from 'express';
import CryptoTransaction from '../models/crypto.model';
import { getCryptoPrice } from '../services/crypto.service';
import { cryptoTransactionSchema } from '../validations/crypto.validation';

export const addCryptoTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error } = cryptoTransactionSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const newTx = new CryptoTransaction(req.body);
        await newTx.save();
        res.status(201).json({ message: 'Transacción criptográfica registrada', data: newTx });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al registrar la transacción' });
    }
};

export const getCryptoPortfolioValue = async (req: Request, res: Response): Promise<void> => {
    try {
        // Le indicamos a TS que coinId es un string
        const coinId = req.params.coinId as string;
        
        const transactions = await CryptoTransaction.find({ coinId: coinId.toLowerCase() });
        
        if (transactions.length === 0) {
            res.status(404).json({ error: `No hay transacciones registradas para la moneda: ${coinId}` });
            return;
        }

        const currentPrice = await getCryptoPrice(coinId);
        
        let totalHoldings = 0;
        transactions.forEach(tx => {
            if (tx.type === 'BUY') totalHoldings += tx.amount;
            if (tx.type === 'SELL') totalHoldings -= tx.amount;
        });

        res.status(200).json({
            coinId: coinId.toLowerCase(),
            totalTokens: totalHoldings,
            currentPriceUsd: currentPrice,
            totalValueUsd: totalHoldings * currentPrice
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};