const router = require('koa-router')();
import FutureHomeController from '../futurehome/index';
import HarmonyHubController from '../harmonyHub/index';
import { stateManager } from '../state/stateManager.js';

const f = new FutureHomeController();
const h = new HarmonyHubController();

/* eslint no-invalid-this: "off"  */
router
  .get('/', function* () {
    this.body = 'Hello world from the smarthome server';
  })
  .get('/state', function*() {
    this.body = {
      mode: stateManager.getSiteMode(),
      temperature: stateManager.getLivingroomTemperature()
    };
  })
  .get('/futurehome/turnOnHomeMode', function*() {
    f.turnOnHomeMode();
    this.body = { message: 'success' };
  })
  .get('/futurehome/shortcut/littlys', function*() {
    f.turnOnALittleLights();
    this.body = { message: 'success' };
  })
  .get('/futurehome/livingroomTemperature', function*() {
    const temperature = yield f.getLivingroomTemperature();
    this.body = { temperature };
  })
  .get('/futurehome/turnOnSleepMode', function*() {
    f.turnOnSleepMode();
    this.body = { message: 'success' };
  })
  .get('/futurehome/livingroomTemperature', function*() {
    f.getLivingroomTemperature()
      .then((temperature) => {
        this.body = { temperature };
      })
      .catch(() => {
        this.body = { message: 'error' };
      });
    this.body = { message: 'success' };
  })
  .get('/turnOffEverything', function*() {
    h.turnOffEverything();
    f.turnOnSleepMode();
    this.body = { message: 'success' };
  })
  .get('/harmony/listenToMusic', function*() {
    h.listenToMusic();
    this.body = { message: 'success' };
  })
  .get('/harmony/appleTv', function*() {
    h.watchAppleTv();
    this.body = { message: 'success' };
  })
  .get('/harmony/movie', function*() {
    h.watchAppleTv();
    f.turnOnMovieLights();
    this.body = { message: 'success' };
  });
export default router;

f.getLivingroomTemperature();
