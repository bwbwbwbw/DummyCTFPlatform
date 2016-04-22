import 'source-map-support/register';
import 'app-module-path/register';
import chalk from 'chalk';
import fs from 'fs-promise';
import FrameworkEntry from 'dg-framework';

import path from 'path';
// without ending slash!
global.__codeRoot = path.join(__dirname, '.');
global.__projectRoot = path.join(__dirname, '..');

(async function start() {

  if (process.getuid && process.getuid() === 0) {
    console.error('Do not run in super privilege.');
    process.exit(1);
    return;
  }

  process.title = 'CTFWebServer';

  let envProfile = 'debug';
  try {
    await fs.stat(`${__projectRoot}/.debug`);
  } catch (ignore) {
    envProfile = 'production';
  }

  if (envProfile === 'production') {
    console.log('Running in %s mode', chalk.green('PRODUCTION'));
  } else {
    console.log('Running in %s mode', chalk.red('DEBUG'));
  }

  const app = new FrameworkEntry({
    env: envProfile,
    config: ['config.yaml', 'config.debug.yaml', 'config.production.yaml'],
    services: 'services.yaml',
    loadModule: (path) => require(`${__codeRoot}/services/${path}`).default,
  });

  global.DI = () => app.DI;

  app.start().catch(e => console.log(e.stack));

})();
