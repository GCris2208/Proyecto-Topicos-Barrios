import { Request, Response } from 'express';
import CryptoTransaction from '../models/crypto.model';
import { getCryptoPrice } from '../services/crypto.service';
//import { cryptoTransactionSchema } from '../validations/crypto.validation';

export const addCryptoTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const newTx = new CryptoTransaction(req.body);
        await newTx.save();
        res.status(201).json({ message: 'Transacción criptográfica registrada', data: newTx });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al registrar la transacción' });
    }
};

export const getCryptoPortfolioValue = async (req: Request, res: Response): Promise<void> => {
    try {
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

export const getCryptoMarketData = async (req: Request, res: Response): Promise<void> => {
    try {
        const coin = req.params.coin as string;
        const price = await getCryptoPrice(coin);
        res.status(200).json({ coin, currentPriceUsd: price });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCryptoTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tx_id } = req.params;
        const deletedTx = await CryptoTransaction.findByIdAndDelete(tx_id);
        if (!deletedTx) {
            res.status(404).json({ error: 'Transacción no encontrada' });
            return;
        }
        res.status(200).json({ message: 'Registro de transacción revertido exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al revertir la transacción' });
    }
};