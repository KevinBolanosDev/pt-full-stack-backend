import { User } from '../models/users.model.js';

export const getUsers = async (req, res) => {
  try {
    // Validación de parámetros
    const page = Math.max(1, parseInt(req.query.page) || 1); //  Obtiene la pagina actual
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20)); // Obtiene el limite de usuarios
    const search = (req.query.search || '').trim(); // Obtiene el termino de busqueda
    
    const [users, totalCount] = await Promise.all([
      User.getAllPaginated(page, limit, search), // Traer usuarios paginados
      User.getTotalCount(search) // Traer el total de usuarios
    ]);
    
    // Si la página solicitada excede el total de páginas, devolver error
    const totalPages = Math.ceil(totalCount / limit);
    if (page > totalPages && totalCount > 0) {
      return res.status(400).json({
        error: 'Página no válida',
        message: `La página máxima disponible es ${totalPages}`
      });
    }
    
    // Devolver respuesta
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

  export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ 
        success: false,
        message: 'ID de usuario no válido'
      });
    }

    const deletedUser = await User.delete(parseInt(id));
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente',
      data: deletedUser
    });
    
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};