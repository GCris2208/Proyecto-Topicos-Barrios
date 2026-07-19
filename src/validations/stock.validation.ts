import Joi from 'joi';

export const stockWatchSchema = Joi.object({
    symbol: Joi.string().trim().uppercase().required().messages({
        'string.empty': 'El símbolo de la acción no puede estar vacío',
        'any.required': 'El símbolo es obligatorio'
    }),
    alertPrice: Joi.number().min(0).required().messages({
        'number.min': 'El precio de alerta debe ser mayor o igual a 0',
        'any.required': 'El precio de alerta es obligatorio'
    })
});