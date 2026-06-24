import express, { Application } from 'express';
import chistesRoutes from './routes/chiste.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

const app: Application = express();

app.use(express.json());

// Montamos la interfaz gráfica de Swagger en esta ruta
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Montamos las rutas de chistes
app.use('/api/chistes', chistesRoutes);

app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'API funcionando correctamente' });
});

export default app;