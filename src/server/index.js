import Koa from 'koa';
import Routes from './routes';
import convert from 'koa-convert';
import cors from 'koa-cors';

const ports = {
  http: process.env.HTTP || 80, //eslint-disable-line no-process-env
  https: process.env.HTTPS || 443 //eslint-disable-line no-process-env
};

const app = new Koa();
app.use(convert(cors()));
app.use(convert(Routes.routes()));
app.use(convert(Routes.allowedMethods()));
app.listen(ports.http);


