import glob from 'glob';
import mongoose from 'mongoose';

export default async function (DI, db) {

  const models = glob.sync(`${__codeRoot}/models/*.js`);
  models.forEach(model => require(model));

  db.connection.modelNames().forEach(name => instance[name] = mongoose.model(name));

}
