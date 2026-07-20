import { Router } from 'express';
import { addCryptoTransaction, getCryptoPortfolioValue, getCryptoMarketData, deleteCryptoTransaction } from '../controllers/crypto.controller';
import { validarEsquema } from '../middlewares/validar.middleware';
import { cryptoTransactionSchema } from '../validations/crypto.validation';

const router = Router();

/**
 * @swagger
 * /crypto/transaction:
 *   post:
 *     summary: Registra una nueva transacción de criptomoneda en el portafolio
 *     tags: [Crypto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CryptoTransaction'
 *     responses:
 *       201:
 *         description: Transacción registrada exitosamente
 *       400:
 *         description: Error de validación en los datos enviados
 *       500:
 *         description: Error interno del servidor
 */
router.post('/transaction', validarEsquema(cryptoTransactionSchema), addCryptoTransaction);

/**
 * @swagger
 * /crypto/{coinId}/portfolio:
 *   get:
 *     summary: Calcula el valor total en USD del portafolio para una moneda específica
 *     tags: [Crypto]
 *     parameters:
 *       - in: path
 *         name: coinId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la criptomoneda en CoinGecko (ej. bitcoin, ethereum)
 *     responses:
 *       200:
 *         description: Valor actualizado del portafolio para la moneda solicitada
 *       404:
 *         description: No hay transacciones registradas para esta moneda
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:coinId/portfolio', getCryptoPortfolioValue);

/**
 * @swagger
 * /crypto/{coin}:
 *   get:
 *     summary: Consulta market cap y fluctuación 24h
 *     tags: [Crypto]
 *     parameters:
 *       - in: path
 *         name: coin
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos de mercado obtenidos exitosamente
 */
router.get('/:coin', getCryptoMarketData);

/**
 * @swagger
 * /crypto/{tx_id}:
 *   delete:
 *     summary: Revierte registro de transacción
 *     tags: [Crypto]
 *     parameters:
 *       - in: path
 *         name: tx_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transacción revertida
 */
router.delete('/:tx_id', deleteCryptoTransaction);

export default router;