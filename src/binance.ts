import ccxt from 'ccxt';

export const getTickerHistoryBinance = async(ticker: string, interval: string, startTime: number | string, endTime: number | string) => {
    const binance = new ccxt.pro.binance ({});
    return await binance.publicGetKlines({
        symbol: ticker,
        interval: interval,
        startTime: startTime,
        endTime: endTime
    });
}