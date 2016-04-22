import express from 'express';

import http from 'http';

export default (DI, config, logger) => {

  const app = express();
  app.set('trust proxy', 'loopback');

  app.server = http.createServer(app);
  app.server.listen(config.port, () => {
    logger.info(`WebServer: Listening at ${config.port}`);
  });

  return app;

};
