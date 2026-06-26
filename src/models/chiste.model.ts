import mongoose, { Schema, Document } from 'mongoose';

export interface IChiste extends Document {
    texto: string;
    autor?: string; // Opcional
    puntaje: number;
    categoria: string;
}

const ChisteSchema: Schema = new Schema({
    texto: { 
        type: String, 
        required: [true, 'El texto del chiste es requerido'] 
    },
    autor: { 
        type: String, 
        default: 'Se perdió en el Ávila como Led' 
    },
    puntaje: { 
        type: Number, 
        required: [true, 'El puntaje es requerido'],
        min: [1, 'El puntaje mínimo es 1'],
        max: [10, 'El puntaje máximo es 10']
    },
    categoria: { 
        type: String, 
        required: [true, 'La categoría es requerida'],
        enum: {
            values: ['Dad joke', 'Humor Negro', 'Chistoso', 'Malo'],
            message: '{VALUE} no es una categoría permitida'
        }
    }
});

export default mongoose.model<IChiste>('Chiste', ChisteSchema);