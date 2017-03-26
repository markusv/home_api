const router = require('koa-router')();
//import FutureHomeController from '../futurehome/index';
//import HarmonyHubController from '../harmonyHub/index';

//const f = new FutureHomeController();
//const h = new HarmonyHubController();

/* eslint no-invalid-this: "off"  */
router
  .get('/', function* () {
    this.body = 'Hello world';
  })
  .get('/futurehome/turnOnHomeMode', function*() {
//    f.turnOnHomeMode();
    this.body = { message: 'success' };
  })
  .get('/futurehome/turnOnSleepMode', function*() {
//    f.turnOnSleepMode();
    this.body = { message: 'success' };
  })
  .get('/turnOffEverything', function*() {
//    h.turnOffEverything();
//    f.turnOnSleepMode();
    this.body = { message: 'success' };
  });
export default router;

