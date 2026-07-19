import { Request, Response } from 'express';
import StockWatch from '../models/stock.model';
import { getStockPrice } from '../services/stock.service';
import { stockWatchSchema } from '../validations/stock.validation';

export const createStockAlert = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error } = stockWatchSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const newAlert = new StockWatch(req.body);
        await newAlert.save();
        res.status(201).json({ message: 'Alerta bursátil creada exitosamente', data: newAlert });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al crear la alerta' });
    }
};

export const getStockStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        // Le indicamos explícitamente a TypeScript que es un string
        const symbol = req.params.symbol as string;
        
        const alert = await StockWatch.findOne({ symbol: symbol.toUpperCase() });
        
        if (!alert) {
            res.status(404).json({ error: `No se encontró una alerta configurada para el símbolo: ${symbol}` });
            return;
        }

        const currentPrice = await getStockPrice(symbol);
        const isTriggered = currentPrice >= alert.alertPrice;

        res.status(200).json({
            symbol: alert.symbol,
            targetAlertPrice: alert.alertPrice,
            currentMarketPrice: currentPrice,
            alertTriggered: isTriggered
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};