import { getTickerHistoryBinance } from "./src/binance";
import { data } from "./src/data"
import { getHoldersCount } from "./src/explorer";
import { timestampToDate } from "./src/other";
import { insertDataDB } from "./src/sql";

const main = async() => {
    const chains = ['eth', 'bsc', 'arbitrum'];

    for (let ticker in data) {
        console.log(`Ticker: ${ticker}`);

        for (let timestamp = 1609459200000 /*2021-01-01*/; timestamp < 1699707600000 /*2023-11-11*/; timestamp += 86400000) {
            const date = timestampToDate(timestamp);
            let holdersCount = 0;
            let MoreThan100 = 0;
            let MoreThan2500 = 0;
            let MoreThan15000 = 0;

            const price = await getTickerHistoryBinance(`${ticker}USDT`, '12h', timestamp, timestamp + 86400000 - 1);
            const openPrice = price.length > 0 ? Number(price[0][1]) : 0;
            const maxPrice = price.length > 0 ? Math.max(price[0][2], price[1][2]) : 0;
            const minPrice = price.length > 0 ? Math.min(price[0][3], price[1][3]) : 0;
            const closePrice = price.length > 0 ? Number(price[1][4]) : 0;

            for (let chain of chains) {
                if (data[ticker][chain]) {
                    const tokenAddress = data[ticker][chain];
                    holdersCount += Number(await getHoldersCount(chain, date, tokenAddress, '0'));
                    MoreThan100 += Number(await getHoldersCount(chain, date, tokenAddress, ((100 / openPrice).toFixed(5)).toString()));
                    MoreThan2500 += Number(await getHoldersCount(chain, date, tokenAddress, ((2500 / openPrice).toFixed(5)).toString()));
                    MoreThan15000 += Number(await getHoldersCount(chain, date, tokenAddress, ((15000 / openPrice).toFixed(5)).toString()));
                }
            }
            console.log(`Date: ${date} Holders: ${holdersCount} Holders: ${MoreThan100}  ${MoreThan2500}  ${MoreThan15000}`);
            const command = `INSERT INTO holders_stat(date,
                ticker,
                holders_count,
                more_than_100,
                more_than_2500,
                more_than_15000,
                open_price,
                high_price,
                low_price,
                close_price)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`
            const value = [date, 
                ticker, 
                holdersCount, 
                MoreThan100, 
                MoreThan2500, 
                MoreThan15000, 
                openPrice,
                maxPrice,
                minPrice,
                closePrice];
            await insertDataDB(command, value);
        }
    }
}

await main();