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
        it('Debería crear un nuevo chiste y retornar código 201', async () => {
            const nuevoChiste = {
                texto: '¿Qué hace una abeja en el gimnasio? ¡Zum-ba!',
                autor: 'Cristian',
                categoria: 'Dad joke',
                puntaje: 8
            };

            const res = await request(app)
                .post('/api/chistes')
                .send(nuevoChiste);

            expect(res.status).toBe(201); // 201 significa "Creado"
            expect(res.body).toHaveProperty('_id'); // Mongo debe haberle asignado un ID
            expect(res.body.texto).toBe(nuevoChiste.texto);
        });

        it('Debería retornar error 400 si falta el texto del chiste', async () => {
            const chisteInvalido = {
                categoria: 'Malo',
                puntaje: 5
            };

            const res = await request(app)
                .post('/api/chistes')
                .send(chisteInvalido);

            expect(res.status).toBe(400); // 400 significa "Bad Request" (Petición incorrecta)
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
    describe('GET /api/chistes/externo/chuck', () => {
        it('Debería obtener un chiste aleatorio de la API de Chuck Norris', async () => {
            const res = await request(app).get('/api/chistes/externo/chuck');
            
            expect(res.status).toBe(200); // Esperamos que la petición sea exitosa
            expect(res.body).toHaveProperty('texto'); // Debe traer el texto del chiste
            expect(res.body).toHaveProperty('autor', 'Chuck Norris API'); // El autor debe indicar la fuente
            expect(res.body).toHaveProperty('categoria');
        });
    });
});