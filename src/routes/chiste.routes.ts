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

import { validarEsquema } from '../middlewares/validar.middleware';
// Asegúrate de importar ambos esquemas
import { chisteSchema, chisteActualizacionSchema } from '../schema/chiste.schema';

const router = Router();

// El POST sigue usando el esquema estricto
router.post('/', validarEsquema(chisteSchema), crearChiste);

router.get('/categoria/:categoria', obtenerCantidadPorCategoria);
router.get('/puntaje/:puntaje', obtenerChistesPorPuntaje);
router.get('/obtener/:tipo', obtenerChisteDinamico);
router.get('/:id', obtenerChistePorId);

// El PUT ahora usa el esquema flexible
router.put('/:id', validarEsquema(chisteActualizacionSchema), actualizarChiste);

router.delete('/:id', eliminarChiste);

export default router;