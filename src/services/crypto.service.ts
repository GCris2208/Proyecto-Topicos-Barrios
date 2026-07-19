import axios from 'axios';

export const getCryptoPrice = async (coinId: string): Promise<number> => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId.toLowerCase()}&vs_currencies=usd`;

    try {
        const response = await axios.get(url);
        
        console.log(`\n--- RESPUESTA DE COINGECKO PARA ${coinId} ---`);
        console.log(response.data);
        console.log(`--------------------------------------------\n`);

        if (!response.data || !response.data[coinId.toLowerCase()]) {
            throw new Error(`CoinGecko no encontró el precio para: ${coinId}. Verifica que el ID sea correcto (ej. 'bitcoin', 'ethereum').`);
        }

        return response.data[coinId.toLowerCase()].usd;
    } catch (error: any) {
        if (error.response && error.response.status === 429) {
            throw new Error('Límite de peticiones de CoinGecko excedido. Por favor, espera un par de minutos antes de intentar de nuevo.');
        }
        
        throw new Error(error.message);
    }
};