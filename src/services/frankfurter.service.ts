import axios from 'axios';

export const getExchangeRate = async (from: string = 'USD', to: string = 'EUR'): Promise<any> => {
    const url = `https://api.frankfurter.dev/v1/latest?from=${from}&to=${to}`;
    
    try {
        const response = await axios.get(url);
        
        console.log(`\n--- RESPUESTA DE FRANKFURTER (${from} a ${to}) ---`);
        console.log(response.data);
        console.log(`--------------------------------------------------\n`);

        if (!response.data || !response.data.rates) {
            throw new Error(`Frankfurter no devolvió tasas para el par ${from}/${to}. Verifica los símbolos.`);
        }

        return response.data;
    } catch (error: any) {
        throw new Error(`Error en Frankfurter: ${error.message}`);
    }
};