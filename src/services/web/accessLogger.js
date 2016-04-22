import morgan from 'morgan';
import fs from 'fs';

export default (DI, app) => {

  app.use(morgan('combined', {
    stream: fs.createWriteStream(`${__projectRoot}/logs/access.log`, { flags: 'a' }),
  }));

}
