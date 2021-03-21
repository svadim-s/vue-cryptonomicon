const API_KEY = "056f0f8287bc4a7b84133d29bf3b9e5a655730191f531ec3abff20f59d0aaefa";

const tickersHandlers = new Map();

export const loadTickers = () => {
    if (tickersHandlers.size === 0) {
        return;
    }

    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()]
        .join(",")}&tsyms=USD&api_key=${API_KEY}`
        )
        .then(r => r.json())
        .then(rawData => {
            const updatedPrices = Object.fromEntries(
                Object.entries(rawData).map(([key, value]) => [key, value.USD])
            );

            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handlers = tickersHandlers.get(currency) ?? [];
                
                handlers.forEach(fn => fn(newPrice));
            });
        });
};

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];

    tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000);

window.tickers = tickersHandlers;