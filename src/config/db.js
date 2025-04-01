import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg

if (!process.env.DATABASE_URL) {
    console.error("Error: La variable de entorno no está definida.");
    process.exit(1);
}

const connectionString = process.env.DATABASE_URL;

export const dbPool = new Pool({
    allowExitOnIdle: true,
    connectionString,
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