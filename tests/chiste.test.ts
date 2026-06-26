import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app'; // Importamos la app, no el server
import dotenv from 'dotenv';

dotenv.config();

describe('Pruebas del API de Chistes', () => {
    
    // Antes de todas las pruebas, conectamos a la BD de pruebas
    beforeAll(async () => {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chistes_db';
        await mongoose.connect(uri);
    });

    // Después de todas las pruebas, cerramos la conexión
    afterAll(async () => {
        await mongoose.connection.dropDatabase(); // Limpia la BD de pruebas (opcional pero recomendado)
        await mongoose.connection.close();
    });

    describe('POST /api/chistes', () => {
        it('Debería crear un nuevo chiste con autor por defecto y retornar código 201', async () => {
            const nuevoChiste = {
                texto: '¿Qué le dice un espagueti a otro? ¡El cuerpo me pide salsa!',
                puntaje: 8,
                categoria: 'Chistoso'
                // No enviamos autor para probar que se asigne el valor por defecto
            };
            
            const res = await request(app).post('/api/chistes').send(nuevoChiste);
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.autor).toBe('Se perdió en el Ávila como Led');
        });

        it('Debería retornar error 400 si falta el texto del chiste', async () => {
            const res = await request(app).post('/api/chistes').send({ puntaje: 5, categoria: 'Malo' });
            expect(res.status).toBe(400);
        });

        it('Debería retornar error 400 si el puntaje no está entre 1 y 10', async () => {
            const res = await request(app).post('/api/chistes').send({ 
                texto: 'Chiste cualquiera', 
                puntaje: 15, // Puntaje inválido
                categoria: 'Malo' 
            });
            expect(res.status).toBe(400);
        });

        it('Debería retornar error 400 si la categoría no es válida', async () => {
            const res = await request(app).post('/api/chistes').send({ 
                texto: 'Chiste cualquiera', 
                puntaje: 5, 
                categoria: 'Inexistente' // Categoría inválida
            });
            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/chistes/:id', () => {
        let chisteId: string;

        // Hook: Antes de correr estas pruebas, inyectamos un chiste directo a la BD para poder buscarlo
        beforeAll(async () => {
            const chistePrueba = await mongoose.model('Chiste').create({
                texto: '¿Cuál es el colmo de un electricista? No encontrar la corriente.',
                autor: 'Nikola Tesla',
                categoria: 'Malo',
                puntaje: 2
            });
            chisteId = chistePrueba._id.toString();
        });

        it('Debería obtener un chiste por su ID y retornar código 200', async () => {
            const res = await request(app).get(`/api/chistes/${chisteId}`);

            expect(res.status).toBe(200); // 200 significa "OK"
            expect(res.body).toHaveProperty('_id', chisteId);
            expect(res.body.texto).toBe('¿Cuál es el colmo de un electricista? No encontrar la corriente.');
        });

        it('Debería retornar error 404 si el chiste no existe', async () => {
            // Generamos un ID de Mongo válido en formato, pero que sabemos que no existe
            const idInexistente = new mongoose.Types.ObjectId(); 
            
            const res = await request(app).get(`/api/chistes/${idInexistente}`);

            expect(res.status).toBe(404); // 404 significa "No encontrado"
        });
    });

    describe('PUT /api/chistes/:id', () => {
        let chisteId: string;

        beforeAll(async () => {
            const chistePrueba = await mongoose.model('Chiste').create({
                texto: 'Chiste viejo',
                categoria: 'Malo',
                puntaje: 3
            });
            chisteId = chistePrueba._id.toString();
        });

        it('Debería actualizar un chiste y retornar código 200', async () => {
            const actualizacion = { puntaje: 9, texto: 'Chiste mejorado' };
            
            const res = await request(app)
                .put(`/api/chistes/${chisteId}`)
                .send(actualizacion);

            expect(res.status).toBe(200);
            expect(res.body.puntaje).toBe(9);
            expect(res.body.texto).toBe('Chiste mejorado');
        });

        it('Debería retornar error 404 si el chiste a actualizar no existe', async () => {
            const idInexistente = new mongoose.Types.ObjectId();
            const res = await request(app).put(`/api/chistes/${idInexistente}`).send({ puntaje: 10 });
            
            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /api/chistes/:id', () => {
        let chisteId: string;

        beforeAll(async () => {
            const chistePrueba = await mongoose.model('Chiste').create({
                texto: 'Chiste para borrar',
                categoria: 'Malo',
                puntaje: 1
            });
            chisteId = chistePrueba._id.toString();
        });

        it('Debería eliminar un chiste y retornar código 200', async () => {
            const res = await request(app).delete(`/api/chistes/${chisteId}`);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Chiste eliminado correctamente');
        });

        it('Debería retornar error 404 si el chiste a eliminar no existe', async () => {
            const idInexistente = new mongoose.Types.ObjectId();
            const res = await request(app).delete(`/api/chistes/${idInexistente}`);
            
            expect(res.status).toBe(404);
        });
    });
    describe('GET /api/chistes/categoria/:categoria', () => {
        beforeAll(async () => {
            // Insertamos un par de chistes para asegurar que la categoría tenga datos
            await mongoose.model('Chiste').create([
                { texto: 'Dad joke 1', categoria: 'Dad joke', puntaje: 5 },
                { texto: 'Dad joke 2', categoria: 'Dad joke', puntaje: 6 }
            ]);
        });

        it('Debería obtener la cantidad de chistes por categoría', async () => {
            const res = await request(app).get('/api/chistes/categoria/Dad joke');
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('categoria', 'Dad joke');
            expect(res.body).toHaveProperty('cantidad');
            expect(res.body.cantidad).toBeGreaterThanOrEqual(2);
        });

        it('Debería retornar error 404 si no hay chistes en esa categoría', async () => {
            const res = await request(app).get('/api/chistes/categoria/Humor Negro');
            
            expect(res.status).toBe(404);
        });
    });

    describe('GET /api/chistes/puntaje/:puntaje', () => {
        beforeAll(async () => {
            await mongoose.model('Chiste').create({
                texto: 'Chiste perfecto',
                categoria: 'Chistoso',
                puntaje: 10
            });
        });

        it('Debería obtener un arreglo de chistes filtrados por puntaje', async () => {
            const res = await request(app).get('/api/chistes/puntaje/10');
            
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
            expect(res.body[0].puntaje).toBe(10);
        });

        it('Debería retornar error 404 si no hay chistes con ese puntaje', async () => {
            const res = await request(app).get('/api/chistes/puntaje/4');
            
            expect(res.status).toBe(404);
        });
    });
    describe('GET /api/chistes/obtener/:tipo', () => {
        it('Debería obtener un chiste de Chuck Norris si el parámetro es "Chuck"', async () => {
            const res = await request(app).get('/api/chistes/obtener/Chuck');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('texto');
        });

        it('Debería obtener un Dad Joke si el parámetro es "Dad"', async () => {
            const res = await request(app).get('/api/chistes/obtener/Dad');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('texto');
        });

        it('Debería obtener un chiste de la DB si el parámetro es "Propio"', async () => {
            // Aseguramos que haya al menos un chiste en la DB
            await mongoose.model('Chiste').create({
                texto: 'Chiste de prueba para Propio',
                puntaje: 5,
                categoria: 'Malo'
            });

            const res = await request(app).get('/api/chistes/obtener/Propio');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('texto');
        });

        it('Debería retornar error si el parámetro no es válido', async () => {
            const res = await request(app).get('/api/chistes/obtener/Invalido');
            expect(res.status).toBe(400); // Bad request
            expect(res.body).toHaveProperty('error');
        });
    });
});