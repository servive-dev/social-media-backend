import redisClient from '../config/redis.config.js';

// Function to get cache by key
export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting cache:', error);
        return null;
    }
}

// Function to set cache with TTL (time to live)
export const setCache = async (key, value, ttl = 3600) => {
    try {
        await redisClient.set(
            key,
            JSON.stringify(value),
            { EX: ttl }
        );
    } catch (error) {
        console.error('Error setting cache:', error

        )
    }
};

// Function to delete cache by key
export const deleteCache = async (key) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error('Error deleting cache:', error);
    }
};

// function to increment by cache key 
export const incrementCache = async(key) => {
    try {
        return await redisClient.incr(key);
    } catch (error) {
        console.error('Error while increment in redis: ', error)
    }
}

// function to get ttl by cache key 
export const ttlCache = async(key) => {
    try {
        return await redisClient.ttl(key);
    } catch (error) {
        console.error('Error while increment in redis: ', error)
    }
}

// function to expire the data by cache key 
export const expiredCache = async(key, time) => {
    try {
        await redisClient.expire(key, time)
    } catch (error) {
        console.error('Error while increment in redis: ', error)
    }
}
