import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

// Inicializa dotenv para leer el archivo .env
dotenv.config();

const PORT = process.env.PORT || 3000;

// Primero conectamos la BD, luego levantamos el servidor HTTP
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
});