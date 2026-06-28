import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validarEsquema = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // abortEarly: false hace que Joi revise todos los campos en vez de detenerse en el primer error
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            res.status(400).json({
                error: 'Error de validación en el payload',
                detalles: error.details.map(err => ({
                    campo: err.path.join('.'),
                    mensaje: err.message
                }))
            });
            return;
        }
        
        next();
    };
};