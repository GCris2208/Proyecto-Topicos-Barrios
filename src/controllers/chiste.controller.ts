import axios from 'axios'; // <-- NUEVO IMPORT
import { Request, Response } from 'express';
import Chiste from '../models/chiste.model';

export const crearChiste = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body.texto) {
            res.status(400).json({ error: 'El texto del chiste es requerido' });
            return;
        }
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

// NUEVO: Obtener chiste de API Externa (Chuck Norris)
export const obtenerChisteChuckNorris = async (req: Request, res: Response): Promise<void> => {
    try {
        // Hacemos una petición GET a la API de Chuck Norris
        const respuesta = await axios.get('https://api.chucknorris.io/jokes/random');
        
        // Formateamos la respuesta para que coincida con nuestra estructura esperada
        const chisteFormateado = {
            texto: respuesta.data.value, // La API de Chuck Norris devuelve el texto dentro de "value"
            autor: 'Chuck Norris API',
            categoria: 'Humor Negro', // Asignamos una categoría por defecto válida en nuestro modelo
            puntaje: 10 // Todos los chistes de Chuck Norris son un 10 
        };

        res.status(200).json(chisteFormateado);
    } catch (error: any) {
        res.status(500).json({ error: 'Error al comunicarse con la API de Chuck Norris' });
    }
};