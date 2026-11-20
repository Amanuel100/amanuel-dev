import mysql from 'mysql2/promise';
import { env } from '../config';
export const pool = mysql.createPool({ host: env.DB_HOST, port: env.DB_PORT, user: env.DB_USER, password: env.DB_PASSWORD, database: env.DB_NAME, waitForConnections: true, connectionLimit: 10, queueLimit: 50, charset: 'utf8mb4', timezone: 'Z', connectTimeout: 10000, multipleStatements: false, ssl: env.DB_SSL ? { rejectUnauthorized: true } : undefined });
