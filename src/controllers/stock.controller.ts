import { Request, Response } from 'express';
import StockWatch from '../models/stock.model';
import { getStockPrice } from '../services/stock.service';
//import { stockWatchSchema } from '../validations/stock.validation';

export const createStockAlert = async (req: Request, res: Response): Promise<void> => {
    try {
        const newAlert = new StockWatch(req.body);
        await newAlert.save();
        res.status(201).json({ message: 'Alerta bursátil creada exitosamente', data: newAlert });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al crear la alerta' });
    }
};

export const getStockStatus = async (req: Request, res: Response): Promise<void> => {
    try {
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

export const getStockHistory = async (_req: Request, res: Response): Promise<void> => {
    try {
        const alerts = await StockWatch.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({ message: 'Historial de tendencias consultado', data: alerts });
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno al consultar historial' });
    }
};

export const deleteStockAlert = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedAlert = await StockWatch.findByIdAndDelete(id);
        if (!deletedAlert) {
            res.status(404).json({ error: 'Alerta no encontrada' });
            return;
        }
        res.status(200).json({ message: 'Alerta de precio eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la alerta' });
    }
};