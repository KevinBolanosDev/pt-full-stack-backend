import { dbPool } from '../config/db.js';

export class User {
  static async getAllPaginated(page = 1, limit = 10, search = '') {
    try {
      const offset = (page - 1) * limit;
      let query, params;
  
      if (search) {
        query = `
          SELECT id, nombre, email, created_at 
          FROM usuarios 
          WHERE nombre ILIKE $1
          ORDER BY id 
          LIMIT $2 OFFSET $3
        `;
        params = [`%${search}%`, limit, offset];
      } else {
        query = `
          SELECT id, nombre, email, created_at 
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

  static async createTable() {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
      CREATE INDEX IF NOT EXISTS idx_usuarios_nombre ON usuarios(nombre);
    `);
  }

  static async seedDatabase(count = 100000) {
    const batchSize = 1000;
    const batches = Math.ceil(count / batchSize);

    for (let i = 0; i < batches; i++) {
      const values = [];
      const params = [];
      let paramCount = 1;

      for (let j = 0; j < batchSize && (i * batchSize + j) < count; j++) {
        const userNumber = i * batchSize + j + 1;
        values.push(`($${paramCount}, $${paramCount + 1})`);
        params.push(
          `Usuario ${userNumber}`,
          `usuario${userNumber}@example.com`
        );
        paramCount += 2;
      }

      const query = `
        INSERT INTO usuarios (nombre, email)
        VALUES ${values.join(', ')}
        ON CONFLICT (email) DO NOTHING;
      `;

      await dbPool.query(query, params);
      console.log(`Batch ${i + 1}/${batches} completed`);
    }
  }
}