import { User } from '../models/users.model.js';

export const getUsers = async (req, res) => {
  try {
    // Validación de parámetros
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const search = (req.query.search || '').trim();
    
    const [users, totalCount] = await Promise.all([
      User.getAllPaginated(page, limit, search),
      User.getTotalCount(search)
    ]);
    
    // Si la página solicitada excede el total de páginas, devolver error
    const totalPages = Math.ceil(totalCount / limit);
    if (page > totalPages && totalCount > 0) {
      return res.status(400).json({
        error: 'Página no válida',
        message: `La página máxima disponible es ${totalPages}`
      });
    }
    
    res.json({
      page,
      limit,
      total: totalCount,
      totalPages,
      search: search || undefined,
      data: users,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener usuarios'
    });
  }
};