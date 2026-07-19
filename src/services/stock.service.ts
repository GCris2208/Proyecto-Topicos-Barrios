import axios from 'axios';

export const getStockPrice = async (symbol: string): Promise<number> => {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    try {
        const response = await axios.get(url);
        
        console.log(`\n--- RESPUESTA DE ALPHAVANTAGE PARA ${symbol} ---`);
        console.log(response.data);
        console.log(`-------------------------------------------\n`);

        const quote = response.data['Global Quote'];

        if (!quote || !quote['05. price']) {
            const apiWarning = response.data['Information'] || response.data['Error Message'] || 'Respuesta irreconocible';
            throw new Error(`AlphaVantage rechazó la consulta. Razón: ${apiWarning}`);
        }

        return parseFloat(quote['05. price']);
    } catch (error: any) {
        throw new Error(error.message);
    }
};