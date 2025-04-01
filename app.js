import express from 'express';
import cors from 'cors';
// import testRouter from './src/routes/test.routes.js'; // Nota: esta línea es para pruebas
import usersRoutes from './src/routes/users.routes.js';
import { PORT } from './config.js'

const app = express();

// Middleware
app.use(express.json());

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
));

// app.use('/api', testRouter); // Prueba de ruta

app.use('/api', usersRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on the port http://localhost:${PORT}`);
});