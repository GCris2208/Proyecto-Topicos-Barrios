
import Joi from 'joi';

// Esquema actual para el POST
export const chisteSchema = Joi.object({
    texto: Joi.string().required().messages({
        'string.empty': 'El texto del chiste es requerido',
        'any.required': 'El texto del chiste es requerido'
    }),
    autor: Joi.string().optional(),
    puntaje: Joi.number().min(1).max(10).required().messages({
        'number.min': 'El puntaje mínimo es 1',
        'number.max': 'El puntaje máximo es 10',
        'any.required': 'El puntaje es requerido',
        'number.base': 'El puntaje debe ser un número'
    }),
    categoria: Joi.string().valid('Dad joke', 'Humor Negro', 'Chistoso', 'Malo').required().messages({
        'any.only': 'Categoría no válida. Debe ser: Dad joke, Humor Negro, Chistoso o Malo',
        'any.required': 'La categoría es requerida'
    })
});

// Nuevo esquema para el PUT
export const chisteActualizacionSchema = Joi.object({
    texto: Joi.string().messages({
        'string.empty': 'El texto del chiste no puede estar vacío'
    }),
    autor: Joi.string().optional(),
    puntaje: Joi.number().min(1).max(10).messages({
        'number.min': 'El puntaje mínimo es 1',
        'number.max': 'El puntaje máximo es 10',
        'number.base': 'El puntaje debe ser un número'
    }),
    categoria: Joi.string().valid('Dad joke', 'Humor Negro', 'Chistoso', 'Malo').messages({
        'any.only': 'Categoría no válida. Debe ser: Dad joke, Humor Negro, Chistoso o Malo'
    })
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
});
