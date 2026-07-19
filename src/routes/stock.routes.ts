import { Router } from 'express';
import { addCryptoTransaction, getCryptoPortfolioValue } from '../controllers/crypto.controller';

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
router.post('/transaction', addCryptoTransaction);

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

export default router;