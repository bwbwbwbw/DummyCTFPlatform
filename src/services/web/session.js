import session from 'express-session';
import mongoSession from 'connect-mongo';

export default (DI, app, config, db) => {

  const MongoStore = mongoSession(session);
  const sessionMiddleware = session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db.connection,
    }),
  });

  app.use(sessionMiddleware);

  return sessionMiddleware;

}
