CREATE TABLE holders_stat (
    id SERIAL PRIMARY KEY,
    date DATE,
    ticker VARCHAR(8),
    holders_count INT,
    more_than_100 INT,
    more_than_2500 INT,
    more_than_15000 INT,
    open_price VARCHAR(255),
    high_price VARCHAR(255),
    low_price VARCHAR(255),
    close_price VARCHAR(255)
);