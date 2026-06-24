import { Router } from 'express';
import { 
    crearChiste, 
    obtenerChistePorId, 
    actualizarChiste, 
    eliminarChiste,
    obtenerCantidadPorCategoria,
    obtenerChistesPorPuntaje,
    obtenerChisteChuckNorris
} from '../controllers/chiste.controller';

const router = Router();

/**
 * @swagger
 * components:
 * schemas:
 * Chiste:
 * type: object
 * required:
 * - texto
 * properties:
 * _id:
 * type: string
 * description: ID autogenerado por MongoDB
 * texto:
 * type: string
 * description: El contenido del chiste
 * autor:
 * type: string
 * description: Creador del chiste
 * categoria:
 * type: string
 * description: Categoría (ej. Dad joke, Humor Negro)
 * puntaje:
 * type: number
 * description: Calificación del 1 al 10
 */

/**
 * @swagger
 * /api/chistes:
 * post:
 * summary: Crea un nuevo chiste
 * tags: [CRUD Principal]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Chiste'
 * responses:
 * 201:
 * description: Chiste creado exitosamente
 * 400:
 * description: Faltan datos requeridos
 */
router.post('/', crearChiste);

/**
 * @swagger
 * /api/chistes/categoria/{categoria}:
 * get:
 * summary: Obtiene la cantidad de chistes por categoría
 * tags: [Filtros y Búsquedas]
 * parameters:
 * - in: path
 * name: categoria
 * required: true
 * schema:
 * type: string
 * description: Nombre de la categoría
 * responses:
 * 200:
 * description: Cantidad de chistes encontrada exitosamente
 * 404:
 * description: No existen chistes para esta categoría
 */
router.get('/categoria/:categoria', obtenerCantidadPorCategoria);

/**
 * @swagger
 * /api/chistes/puntaje/{puntaje}:
 * get:
 * summary: Obtiene chistes filtrados por puntaje exacto
 * tags: [Filtros y Búsquedas]
 * parameters:
 * - in: path
 * name: puntaje
 * required: true
 * schema:
 * type: number
 * description: Puntaje del 1 al 10
 * responses:
 * 200:
 * description: Lista de chistes devuelta exitosamente
 * 404:
 * description: No existen chistes con ese puntaje
 */
router.get('/puntaje/:puntaje', obtenerChistesPorPuntaje);

/**
 * @swagger
 * /api/chistes/externo/chuck:
 * get:
 * summary: Obtiene un chiste aleatorio de la API de Chuck Norris
 * tags: [API Externa]
 * responses:
 * 200:
 * description: Chiste obtenido y adaptado a nuestro modelo
 */
router.get('/externo/chuck', obtenerChisteChuckNorris);

/**
 * @swagger
 * /api/chistes/{id}:
 * get:
 * summary: Obtiene un chiste por su ID
 * tags: [CRUD Principal]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: ID del chiste en MongoDB
 * responses:
 * 200:
 * description: Datos del chiste
 * 404:
 * description: Chiste no encontrado
 * put:
 * summary: Actualiza un chiste existente
 * tags: [CRUD Principal]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Chiste'
 * responses:
 * 200:
 * description: Chiste actualizado exitosamente
 * delete:
 * summary: Elimina un chiste por su ID
 * tags: [CRUD Principal]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Chiste eliminado correctamente
 */
router.get('/:id', obtenerChistePorId);
router.put('/:id', actualizarChiste);
router.delete('/:id', eliminarChiste);

export default router;