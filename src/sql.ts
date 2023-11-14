import { Client } from 'pg'
import * as dotenv from 'dotenv';
dotenv.config();

export const connectClient = () => {
    return new Client({
        host: process.env.Host,
        port: process.env.Port,
        database: 'postgres',
        user: process.env.User,
        password: process.env.Password,
    });
}

export const insertDataDB = async(command: string, values: (string | number)[]) => {
    const client = connectClient();
    await client.connect();
 
    await client.query(command, values);
    await client.end();
}