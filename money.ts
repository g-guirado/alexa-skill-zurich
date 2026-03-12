import axios from 'axios';

interface CurrencyRate {
  val: number;
}

interface ExchangeRateResponse {
  CHF_EUR: CurrencyRate;
  CHF_USD: CurrencyRate;
}

export async function getExchangeRates(): Promise<string> {
  const res = await axios.get<ExchangeRateResponse>(
    'https://free.currencyconverterapi.com/api/v6/convert?q=CHF_EUR,CHF_USD&compact=y'
  );
  const eur = res.data.CHF_EUR.val;
  const usd = res.data.CHF_USD.val;
  return `One franc is ${eur.toFixed(2)} euros or ${usd.toFixed(2)} dollars`;
}
