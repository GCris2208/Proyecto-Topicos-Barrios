import mongoose, { Schema, Document } from 'mongoose';

export interface IStockWatch extends Document {
    symbol: string;
    alertPrice: number;
    createdAt: Date;
}

const StockWatchSchema: Schema = new Schema({
    symbol: { 
        type: String, 
        required: true,
        uppercase: true,
        trim: true
    },
    alertPrice: { 
        type: Number, 
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IStockWatch>('StockWatch', StockWatchSchema);