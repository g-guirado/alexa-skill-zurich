const axios = require('axios');

async function getExchangeRates() {
    const res = await axios('https://free.currencyconverterapi.com/api/v6/convert?q=CHF_EUR,CHF_USD&compact=y');
    const eur = res.data['CHF_EUR'].val;
    const usd = res.data['CHF_USD'].val;
    return `One franc is ${eur.toFixed(2)} euros or ${usd.toFixed(2)} dollars`;
}

module.exports = {
    getExchangeRates
  }
