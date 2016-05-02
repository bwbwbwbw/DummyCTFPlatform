import express from 'express';

export default (DI, app) => {

  app.use(express.static(`${__projectRoot}/.uibuild`));

};
