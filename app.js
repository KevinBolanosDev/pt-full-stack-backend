import express from 'express';
import testRouter from './src/routes/test.routes.js'; // <-- Añadir esta línea
import usersRoutes from './src/routes/users.routes.js';
import { PORT } from './config.js'

const app = express();

// Middleware
app.use(express.json());

app.use('/api', testRouter); // <-- Añadir esta línea
app.use('/api', usersRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on the port http://localhost:${PORT}`);
});