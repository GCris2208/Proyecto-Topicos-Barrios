import Joi from 'joi';

export const cryptoTransactionSchema = Joi.object({
    coinId: Joi.string().trim().lowercase().required().messages({
        'string.empty': 'El ID de la moneda no puede estar vacío',
        'any.required': 'El ID de la moneda es obligatorio'
    }),
    type: Joi.string().valid('BUY', 'SELL').required().messages({
        'any.only': 'El tipo de transacción debe ser BUY o SELL',
        'any.required': 'El tipo de transacción es obligatorio'
    }),
    amount: Joi.number().greater(0).required().messages({
        'number.greater': 'La cantidad debe ser mayor a 0',
        'any.required': 'La cantidad es obligatoria'
    }),
    priceAtTransaction: Joi.number().min(0).required().messages({
        'number.min': 'El precio debe ser mayor o igual a 0',
        'any.required': 'El precio en la transacción es obligatorio'
    })
});