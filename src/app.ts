import express, { Application } from 'express';
import stockRoutes from './routes/stock.routes';
import cryptoRoutes from './routes/crypto.routes';
import { setupSwagger } from './config/swagger';

const app: Application = express();

app.use(express.json());

setupSwagger(app);

// Rutas de AssetMatrix
app.use('/api/v1/stocks', stockRoutes);
app.use('/api/v1/crypto', cryptoRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado en AssetMatrix API' });
});

export default app;