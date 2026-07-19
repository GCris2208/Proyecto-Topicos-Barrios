import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/assetmatrix_db';
        await mongoose.connect(uri);
        console.log('Base de datos AssetMatrix conectada exitosamente');
    } catch (error) {
        console.error('Error conectando a la base de datos:', error);
        process.exit(1);
    }
};