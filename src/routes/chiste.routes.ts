import { Router } from 'express';
import { 
    crearChiste, 
    obtenerChistePorId, 
    actualizarChiste, 
    eliminarChiste,
    obtenerCantidadPorCategoria,
    obtenerChistesPorPuntaje,
    obtenerChisteDinamico
} from '../controllers/chiste.controller';

const router = Router();

router.post('/', crearChiste);
router.get('/categoria/:categoria', obtenerCantidadPorCategoria);
router.get('/puntaje/:puntaje', obtenerChistesPorPuntaje);
router.get('/obtener/:tipo', obtenerChisteDinamico); // <-- NUEVA RUTA DEL REQ 1
router.get('/:id', obtenerChistePorId);
router.put('/:id', actualizarChiste);
router.delete('/:id', eliminarChiste);

export default router;