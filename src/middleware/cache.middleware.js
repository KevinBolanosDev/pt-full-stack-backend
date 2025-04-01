/* import redisClient from '../config/redis.js';

export const cacheMiddleware = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const cacheKey = `users:${page}:${limit}:${search || 'all'}`;
    
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    res.locals.cacheKey = cacheKey;
    next();
  } catch (error) {
    next(error);
  }
}; */