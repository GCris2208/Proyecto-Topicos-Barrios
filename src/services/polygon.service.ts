import axios from 'axios';

export const getPolygonData = async (ticker: string, date: string): Promise<any> => {
    const apiKey = process.env.POLYGON_API_KEY || 'TU_KEY';
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${date}/${date}?apiKey=${apiKey}`;
    
    try {
        const response = await axios.get(url);
        
        console.log(`\n--- RESPUESTA DE POLYGON.IO PARA ${ticker} ---`);
        console.log(response.data);
        console.log(`----------------------------------------------\n`);

        if (!response.data || !response.data.results || response.data.resultsCount === 0) {
            throw new Error(`Polygon.io no encontró datos de mercado para ${ticker} en la fecha ${date}.`);
        }

        return response.data.results;
    } catch (error: any) {
        if (error.response && error.response.status === 429) {
            throw new Error('Límite de peticiones de Polygon.io excedido. Espera un minuto.');
        }
        throw new Error(`Error en Polygon.io: ${error.message}`);
    }
};