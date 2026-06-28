import axios from 'axios';
import { Request, Response } from 'express';
import Chiste from '../models/chiste.model';

export const crearChiste = async (req: Request, res: Response): Promise<void> => {
    try {
        //if (!req.body.texto) {
        //    res.status(400).json({ error: 'El texto del chiste es requerido' });
        //    return;
        //}
        const nuevoChiste = new Chiste(req.body);
        const chisteGuardado = await nuevoChiste.save();
        res.status(201).json(chisteGuardado);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerChistePorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const chiste = await Chiste.findById(id);
        if (!chiste) {
            res.status(404).json({ error: 'Chiste no encontrado' });
            return;
        }
        res.status(200).json(chiste);
    } catch (error: any) {
        res.status(400).json({ error: 'Formato de ID inválido' });
    }
};

export const actualizarChiste = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const chisteActualizado = await Chiste.findByIdAndUpdate(id, req.body, {
            returnDocument: 'after',
            runValidators: true
        });

        if (!chisteActualizado) {
            res.status(404).json({ error: 'Chiste no encontrado' });
            return;
        }
        res.status(200).json(chisteActualizado);
    } catch (error: any) {
        res.status(400).json({ error: 'Error al actualizar: Formato de ID inválido o datos incorrectos' });
    }
};

export const eliminarChiste = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const chisteEliminado = await Chiste.findByIdAndDelete(id);

        if (!chisteEliminado) {
            res.status(404).json({ error: 'Chiste no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Chiste eliminado correctamente' });
    } catch (error: any) {
        res.status(400).json({ error: 'Formato de ID inválido' });
    }
};

export const obtenerCantidadPorCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoria } = req.params;
        const cantidad = await Chiste.countDocuments({ categoria });

        if (cantidad === 0) {
            res.status(404).json({ error: 'No existen chistes para esta categoría' });
            return;
        }
        res.status(200).json({ categoria, cantidad });
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerChistesPorPuntaje = async (req: Request, res: Response): Promise<void> => {
    try {
        const { puntaje } = req.params;
        const chistes = await Chiste.find({ puntaje: Number(puntaje) });

        if (chistes.length === 0) {
            res.status(404).json({ error: 'No existen chistes con ese puntaje' });
            return;
        }
        res.status(200).json(chistes);
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// NUEVO: Requerimiento 1 (Endpoint unificado para Chuck, Dad y Propio)
export const obtenerChisteDinamico = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tipo } = req.params;

        // Opción 1: Chuck Norris API
        if (tipo === 'Chuck') {
            const respuesta = await axios.get('https://api.chucknorris.io/jokes/random');
            res.status(200).json({
                texto: respuesta.data.value,
                autor: 'Chuck Norris API',
                categoria: 'Humor Negro',
                puntaje: 10
            });
            return;
        }

        // Opción 2: Dad Joke API
        if (tipo === 'Dad') {
            // Esta API requiere enviar un Header indicando que queremos la respuesta en JSON
            const respuesta = await axios.get('https://icanhazdadjoke.com/', {
                headers: { 'Accept': 'application/json' }
            });
            res.status(200).json({
                texto: respuesta.data.joke,
                autor: 'Dad Joke API',
                categoria: 'Dad joke',
                puntaje: 5
            });
            return;
        }

        // Opción 3: Chiste Propio de la Base de Datos
        if (tipo === 'Propio') {
            // $sample extrae un documento al azar de MongoDB
            const chistes = await Chiste.aggregate([{ $sample: { size: 1 } }]);
            
            if (chistes.length === 0) {
                // El requerimiento exige este mensaje exacto si la BD está vacía
                res.status(200).json({ mensaje: 'Aun no hay chistes, cree uno!' });
                return;
            }
            
            res.status(200).json(chistes[0]);
            return;
        }

        // Opción 4: Parámetro incorrecto
        res.status(400).json({ error: 'Parámetro inválido. Las opciones válidas son: Chuck, Dad o Propio' });
        
    } catch (error: any) {
        res.status(500).json({ error: 'Error interno del servidor al obtener el chiste' });
    }
};