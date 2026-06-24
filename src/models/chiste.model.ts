import mongoose, { Schema, Document } from 'mongoose';

// Definimos la interfaz para TypeScript (ayuda con el autocompletado y tipado)
export interface IChiste extends Document {
    texto: string;
    autor?: string;
    categoria: string;
    puntaje: number;
}

// Definimos el esquema para Mongoose (reglas de la base de datos)
const ChisteSchema: Schema = new Schema({
    texto: { 
        type: String, 
        required: [true, 'El texto del chiste es obligatorio'] 
    },
    autor: { 
        type: String, 
        default: 'Anónimo' // Si no envían autor, toma este valor por defecto
    },
    categoria: { 
        type: String, 
        required: [true, 'La categoría es obligatoria'],
        enum: ['Dad joke', 'Humor Negro', 'Chistoso', 'Malo'] // Restringimos las opciones válidas
    },
    puntaje: { 
        type: Number, 
        required: [true, 'El puntaje es obligatorio'],
        min: [1, 'El puntaje mínimo es 1'],
        max: [10, 'El puntaje máximo es 10']
    }
}, {
    timestamps: true, // Añade fecha de creación y actualización automáticamente
    versionKey: false // Quita el campo __v que añade Mongoose por defecto
});

export default mongoose.model<IChiste>('Chiste', ChisteSchema);