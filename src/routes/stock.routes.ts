import { Router } from 'express';
import { createStockAlert, getStockStatus, getStockHistory, deleteStockAlert } from '../controllers/stock.controller';
import { validarEsquema } from '../middlewares/validar.middleware';
import { stockWatchSchema } from '../validations/stock.validation';

const router = Router();

/**
 * @swagger
 * /stocks:
 *   post:
 *     summary: Crea una nueva alerta bursátil
 *     tags: [Stocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockAlert'
 *     responses:
 *       201:
 *         description: Alerta creada exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', validarEsquema(stockWatchSchema), createStockAlert);

/**
 * @swagger
 * /stocks/history:
 *   get:
 *     summary: Análisis de tendencias históricas
 *     tags: [Stocks]
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 */
router.get('/history', getStockHistory);

/**
 * @swagger
 * /stocks/{symbol}:
 *   get:
 *     summary: Obtiene el estado actual de una acción y comprueba si disparó la alerta
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Símbolo de la acción (ej. AAPL, TSLA)
 *     responses:
 *       200:
 *         description: Estado actual de la acción
 *       404:
 *         description: Alerta no encontrada
 */
router.get('/:symbol', getStockStatus);

/**
 * @swagger
 * /stocks/{id}:
 *   delete:
 *     summary: Elimina alerta de precio
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alerta eliminada exitosamente
 */
router.delete('/:id', deleteStockAlert);

export default router;