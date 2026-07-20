import axios from 'axios';

export const getFredData = async (seriesId: string = 'CPIAUCSL'): Promise<any> => {
    const apiKey = process.env.FRED_API_KEY || 'TU_KEY';
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json`;
    
    try {
        const response = await axios.get(url);
        
        console.log(`\n--- RESPUESTA DE FRED PARA ${seriesId} ---`);
        console.log(response.data);
        console.log(`------------------------------------------\n`);

        if (!response.data || !response.data.observations) {
            throw new Error(`FRED no devolvió observaciones para la serie ${seriesId}.`);
        }

        return response.data.observations;
    } catch (error: any) {
        // FRED suele devolver 400 si la API Key es inválida o la serie no existe
        if (error.response && error.response.status === 400) {
             throw new Error('Petición rechazada por FRED. Verifica tu API Key o el ID de la serie.');
        }
        throw new Error(`Error en FRED: ${error.message}`);
    }
};