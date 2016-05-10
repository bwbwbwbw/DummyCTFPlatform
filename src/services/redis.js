import redis from 'redis';

export default (DI, config, logger) => {

  const client = redis.createClient(config.redis);

  client.on('error', (err) => {
    logger.error('Redis error');
    logger.error(err);
  });

  return client;

};
