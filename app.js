import express from 'express';
import cors from 'cors';
// import testRouter from './src/routes/test.routes.js'; // Nota: esta línea es para pruebas
import usersRoutes from './src/routes/users.routes.js';
import { PORT } from './config.js'

const app = express();
// Configuración de CORS

// Cambia FRONTED_URL por FRONTEND_URL (más semántico)
const allowedOrigin = process.env.FRONTEND_URL || 'https://pt-full-stack-frontend.netlify.app';

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://pt-full-stack-frontend.netlify.app',
      'http://localhost:3000' // Para desarrollo local
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Vary', 'Origin');
  next();
});
app.use(express.json());

app.options('*', cors(corsOptions)); // Para todas las rutas

// app.use('/api', testRouter); // Prueba de ruta
app.use('/api', usersRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on the port http://localhost:${PORT}`);
});