import { dbPool } from '../config/db.js';
import { faker } from '@faker-js/faker/locale/es';

export class User {
  static async getAllPaginated(page = 1, limit = 10, search = '') {
    try {
      const offset = (page - 1) * limit;
      let query, params;
  
      if (search) {
        query = `
          SELECT id, nombre, email, salario, created_at 
          FROM usuarios 
          WHERE nombre ILIKE $1
          ORDER BY id 
          LIMIT $2 OFFSET $3
        `;
        params = [`%${search}%`, limit, offset];
      } else {
        query = `
          SELECT id, nombre, email, salario, created_at 
          FROM usuarios 
          ORDER BY id 
          LIMIT $1 OFFSET $2
        `;
        params = [limit, offset];
      }
  
      const { rows } = await dbPool.query(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching paginated users: ${error.message}`);
    }
  }

  static async getTotalCount(search = '') {
    let query, params;
    
    if (search) {
      query = 'SELECT COUNT(*) FROM usuarios WHERE nombre ILIKE $1';
      params = [`%${search}%`];
    } else {
      query = 'SELECT COUNT(*) FROM usuarios';
      params = [];
    }

    const { rows } = await dbPool.query(query, params);
    return parseInt(rows[0].count);
  }

  // Implementamos los indices para mejorar la busqueda
  static async createTable() {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        salario NUMERIC(100, 5),
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
      CREATE INDEX IF NOT EXISTS idx_usuarios_nombre ON usuarios(nombre);
    `);
  }

  static async seedDatabase(count = 100000) { // Reducimos a 5000 para empezar
    const batchSize = 1000; // Reducimos el tamaño del lote
    const batches = Math.ceil(count / batchSize);
  
    console.log(`Iniciando generación de ${count} usuarios en ${batches} lotes...`);
  
    for (let i = 0; i < batches; i++) {
      const values = [];
      const params = [];
      let paramCount = 1;
  
      for (let j = 0; j < batchSize && (i * batchSize + j) < count; j++) {
        values.push(`($${paramCount}, $${paramCount + 1}, $${paramCount + 2})`);
        params.push(
          faker.person.fullName(),
          faker.internet.email(),
          faker.number.int({ min: 1000, max: 100000, precision: 0.01 }) // Cambiado a float para salarios decimales
        );
        paramCount += 3;
      }
  
      const query = `
        INSERT INTO usuarios (nombre, email, salario)
        VALUES ${values.join(', ')}
        ON CONFLICT (email) DO NOTHING;
      `;
  
      await dbPool.query(query, params);
      const registrosCompletados = Math.min((i + 1) * batchSize, count);
      console.log(`Progreso: ${registrosCompletados}/${count} usuarios creados (${Math.round(registrosCompletados/count * 100)}%)`);
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
    const values = [id];
    
    try {
      const { rows } = await dbPool.query(query, values);
      return rows[0] || null; // Retorna el usuario eliminado o null si no existía
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}