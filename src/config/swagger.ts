import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Chistes - Tópicos Especiales',
            version: '1.0.0',
            description: 'Documentación de la API REST para gestión de chistes integrando Chuck Norris y Dad Jokes.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local',
            },
        ],
        components: {
            schemas: {
                Chiste: {
                    type: 'object',
                    required: ['texto', 'categoria', 'puntaje'],
                    properties: {
                        _id: { type: 'string', description: 'ID autogenerado por MongoDB' },
                        texto: { type: 'string', description: 'El contenido del chiste' },
                        autor: { type: 'string', description: 'Creador del chiste', default: 'Se perdió en el Ávila como Led' },
                        categoria: { type: 'string', description: 'Categoría', enum: ['Dad joke', 'Humor Negro', 'Chistoso', 'Malo'] },
                        puntaje: { type: 'number', description: 'Calificación del 1 al 10', minimum: 1, maximum: 10 }
                    }
                }
            }
        },
        paths: {
            '/api/chistes': {
                post: {
                    summary: 'Crea un nuevo chiste en la Base de Datos',
                    tags: ['CRUD Principal'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Chiste' }
                            }
                        }
                    },
                    responses: {
                        '201': { description: 'Chiste creado exitosamente' },
                        '400': { description: 'Error de validación (faltan datos, puntaje inválido, etc.)' }
                    }
                }
            },
            '/api/chistes/obtener/{tipo}': {
                get: {
                    summary: 'Obtiene un chiste de forma dinámica (Chuck Norris, Dad Joke o Propio)',
                    tags: ['Requerimiento Dinámico'],
                    parameters: [
                        { 
                            in: 'path', 
                            name: 'tipo', 
                            required: true, 
                            schema: { 
                                type: 'string',
                                enum: ['Chuck', 'Dad', 'Propio']
                            }, 
                            description: 'Tipo de chiste a obtener' 
                        }
                    ],
                    responses: {
                        '200': { description: 'Chiste devuelto exitosamente' },
                        '400': { description: 'Parámetro inválido' }
                    }
                }
            },
            '/api/chistes/categoria/{categoria}': {
                get: {
                    summary: 'Obtiene la cantidad de chistes locales por categoría',
                    tags: ['Filtros y Búsquedas'],
                    parameters: [
                        { in: 'path', name: 'categoria', required: true, schema: { type: 'string' }, description: 'Nombre de la categoría' }
                    ],
                    responses: {
                        '200': { description: 'Cantidad de chistes encontrada' },
                        '404': { description: 'No existen chistes para esta categoría' }
                    }
                }
            },
            '/api/chistes/puntaje/{puntaje}': {
                get: {
                    summary: 'Obtiene chistes filtrados por puntaje',
                    tags: ['Filtros y Búsquedas'],
                    parameters: [
                        { in: 'path', name: 'puntaje', required: true, schema: { type: 'number' }, description: 'Puntaje del 1 al 10' }
                    ],
                    responses: {
                        '200': { description: 'Lista de chistes devuelta exitosamente' },
                        '404': { description: 'No existen chistes con ese puntaje' }
                    }
                }
            },
            '/api/chistes/{id}': {
                get: {
                    summary: 'Obtiene un chiste por su ID',
                    tags: ['CRUD Principal'],
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID en MongoDB' }
                    ],
                    responses: {
                        '200': { description: 'Datos del chiste' },
                        '404': { description: 'Chiste no encontrado' }
                    }
                },
                put: {
                    summary: 'Actualiza un chiste existente',
                    tags: ['CRUD Principal'],
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Chiste' }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Chiste actualizado exitosamente' },
                        '404': { description: 'Chiste no encontrado' }
                    }
                },
                delete: {
                    summary: 'Elimina un chiste por su ID',
                    tags: ['CRUD Principal'],
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                    ],
                    responses: {
                        '200': { description: 'Chiste eliminado correctamente' },
                        '404': { description: 'Chiste no encontrado' }
                    }
                }
            }
        }
    },
    apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;