import mongoose, { Schema, Document } from 'mongoose';

export interface ICryptoTransaction extends Document {
    coinId: string;
    type: 'BUY' | 'SELL';
    amount: number;
    priceAtTransaction: number;
    transactionDate: Date;
}

const CryptoTransactionSchema: Schema = new Schema({
    coinId: { 
        type: String, 
        required: true,
        lowercase: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['BUY', 'SELL']
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0.00000001
    },
    priceAtTransaction: {
        type: Number,
        required: true,
        min: 0
    },
    transactionDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<ICryptoTransaction>('CryptoTransaction', CryptoTransactionSchema);