import glob from 'glob';
import mongoose from 'mongoose';

export default async (DI, config, logger) => {

  const db = await new Promise((resolve, reject) => {
    logger.debug(`MongoDB: Connection Url = ${config.db}`);
    mongoose.connect(config.db);
    const db = mongoose.connection;
    db.on('error', () => {
      reject(new Error(`unable to connect to database at ${config.db}`));
    });
    db.once('open', () => {
      logger.info(`MongoDB: Connected`);
      resolve(db);
    });
  });

  return { connection: db };

}
