import express from 'express';
import cors from 'cors';
// import testRouter from './src/routes/test.routes.js'; // Nota: esta línea es para pruebas
import usersRoutes from './src/routes/users.routes.js';
import { PORT } from './config.js'

const app = express();
// Configuración de CORS
app.use(
    cors({
        origin: process.env.FRONTED_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

// Middleware
app.use(express.json());

// app.use('/api', testRouter); // Prueba de ruta

app.use('/api', usersRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on the port http://localhost:${PORT}`);
});