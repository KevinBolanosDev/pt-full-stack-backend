import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

export const dbPool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const initializeDB = async () => {
    try {
        const result = await dbPool.query('SELECT NOW()');
        console.log("Conexión a la base de datos exitosa:", result.rows[0].now);
    } catch (error) {
        console.error('❌ Error de conexión a la base de datos:', error);
        process.exit(1); // Detiene la aplicación si hay un error de conexión
    }
};

initializeDB();