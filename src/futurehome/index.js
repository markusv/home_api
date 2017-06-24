import config from '../config/futurehome';
import simpleOauth from 'simple-oauth2';
import https from 'https';
import Passwords from '../config/password';
import { stateManager } from '../state/stateManager.js';
import WebSocket from 'ws';
import Constants from '../constants/index.js';
import { log } from '../server/logger';

// Get the access token object.
const tokenConfig = {
  username: config.username,
  password: Passwords.futureHome
};

export default class FutureHomeController {

  constructor() {
    this.oauth = simpleOauth.create(config.credentials);
    this.processFutureHomeStreamMessage = this.processFutureHomeStreamMessage.bind(this);
    this.processLivingroomMotionSensorStreamMessage = this.processLivingroomMotionSensorStreamMessage.bind(this);
    this.withToken().then(() => {
      this.subscribeToFutureHomeSiteStream();
      this.subscribeToLivingroomMotionSensorStream();
      this.loadSiteState();
    });
  }

  getLivingroomTemperature() {
    const p = new Promise((resolve, reject) => {
      this.withToken().then(() => {
        const options = {
          host: `${config.apiBaseURL}`,
          path: `${config.apiUrlPrefix}/sites/${config.mySiteId}/devices/${config.livingroomMotionSensorId}`,
          method: 'GET',
          headers: this.createHeaders(false)
        };
        https.get(options, (res) => {
          let json = '';
          res.on('data', (chunk) => { json += chunk; });
          res.on('end', () => {
            if (res.statusCode === 200) {
              const data = JSON.parse(json);
              resolve(data.temperature);
            }
            else {
              reject(res.statusCode);
            }
          });
        }).on('error', (err) => {
          reject(err);
        });
      });
    });
    return p;
  }

  turnOnSleepMode() {
    this.turnOnMode('sleep');
  }

  turnOnHomeMode() {
    this.turnOnMode('home');
  }

  turnOnMode(mode) {
    this.withToken().then(() => {
      const options = {
        host: `${config.apiBaseURL}`,
        path: `${config.apiUrlPrefix}/sites/${config.mySiteId}`,
        method: 'PATCH',
        headers: this.createHeaders(true)
      };
      const req = https.request(options);
      req.write(`mode=${mode}`);
      req.end();
    });
  }

  createHeaders(form) {
    const headers = {
      Authorization: `Bearer ${this.token.token.access_token}`
    };
    if (!form) { return headers; }
    headers['Content-type'] = 'application/x-www-form-urlencoded';
    return headers;
  }

  withToken() {
    return new Promise((resolve) => {
      if (this.token && !this.token.expired()) {
        resolve();
        return;
      }
      else if (this.token && this.token.expired()) {
        this.refreshToken(resolve);
        return;
      }

      this.oauth.ownerPassword.getToken(tokenConfig)
        .then((result) => {
          this.token = this.oauth.accessToken.create(result);
          resolve();
        });
    });
  }

  refreshToken(resolve) {
    if (!this.token.expired()) { resolve(); }
    this.token.refresh().then((newToken) => {
      this.token = newToken;
      resolve();
    });
  }

  loadSiteState() {
    this.withToken().then(() => {
      const options = {
        host: `${config.apiBaseURL}`,
        path: `${config.apiUrlPrefix}/sites/${config.mySiteId}`,
        method: 'GET',
        headers: this.createHeaders(false)
      };
      https.get(options, (res) => {
        let json = '';
        res.on('data', (chunk) => { json += chunk; });
        res.on('end', () => {
          if (res.statusCode !== 200) { return; }
          this.processSiteStateResponse(JSON.parse(json));
        });
      });
    });
  }

  processSiteStateResponse(response) {
    stateManager.setSiteMode(response.mode);
    stateManager.setLivingroomTemperature(response.temperature.inside);
  }

  createLivingroomMotionSensorStreamUrl() {
    return `https://${config.apiBaseURL}${config.apiUrlPrefix}/sites/${config.mySiteId}/devices/` +
    `${config.livingroomMotionSensorId}/stream?access_token=${this.token.token.access_token}`;
  }

  subscribeToLivingroomMotionSensorStream() {
    let start = 0;
    this.openWebsocket({
      url: this.createLivingroomMotionSensorStreamUrl(),
      onMessage: this.processLivingroomMotionSensorStreamMessage,
      onOpen: () => {
        start = (new Date()).getTime();
        log('motiondetector stream connected');
      },
      onClose: (code, reason) => {
        log('motiondetector stream disconnected', ((new Date()).getTime() - start ), code, reason);
      },
      onReconnect: (count) => {
        log(`motiondetector stream reconnect counter: ${count}`);
      },
      counter: 0
    });
  }

  processLivingroomMotionSensorStreamMessage(data) {
    log('livingroom stream message', data);
  }

  createFutureHomeWsStreamUrl() {
    return `https://${config.apiBaseURL}${config.apiUrlPrefix}/sites/${config.mySiteId}/stream?access_token=${this.token.token.access_token}`;
  }

  subscribeToFutureHomeSiteStream() {
    let start = 0;
    this.openWebsocket({
      url: this.createFutureHomeWsStreamUrl(),
      onMessage: this.processFutureHomeStreamMessage,
      onOpen: () => {
        start = (new Date()).getTime();
        log('site stream connected');
      },
      onClose: (code, reason) => {
        log('site stream disconnected', ((new Date()).getTime() - start ), code, reason);
      },
      onReconnect: (count) => {
        log(`site stream reconnect counter: ${count}`);
      },
      counter: 0
    });
  }

  openWebsocket(config) {
    //url, onMessage, onOpen, onClose, onReconnect, counter
    if (config.counter === Constants.MAX_WS_RETRY_COUNT) { return null; } // stop trying after 10 errors

    let retryCounter = config.counter;
    const ws = new WebSocket(config.url);
    ws.on('message', config.onMessage);
    ws.on('open', () => {
      retryCounter = 0;
      if (config.onOpen) { config.onOpen(); }
      ws.isOpen = true;
      this.startWSPingInterval(ws);
    });

    ws.on('close', (code, reason) => {
      ws.isOpen = false;
      log(`websocket closed: ${config.url}, code: ${code}, reason: ${reason}`);
      if (retryCounter < Constants.MAX_WS_RETRY_COUNT) {
        retryCounter++;
        setTimeout(() => {
          this.openWebsocket(config);
          if (config.onReconnect) { config.onReconnect(retryCounter); }
        }, Constants.WS_RECONNECT_TIMEOUT);
      }
      else if (config.onClose) { config.onClose(code, reason); }
    });
    return ws;
  }

  processFutureHomeStreamMessage(data) {
    if (!data) { return; }
    log('processFutureHomeSiteStreamMessage', data);
    const message = JSON.parse(data);
    if (message.site) { this.processSiteMessage(message); }
    if (message.devices) { this.processDeviceMessage(message); }
    if (message.rooms) { this.processRoomMessage(message); }
  }

  processRoomMessage(message) {
    message.rooms.forEach((room) => {
      if (room.current_temperature) { stateManager.setLivingroomTemperature(room.current_temperature); }
    });
  }

  processDeviceMessage(message) {
    message.devices.forEach((device) => {
      if (device.temperature) { stateManager.setLivingroomTemperature(device.temperature); }
    });
  }

  processSiteMessage(message) {
    const siteMessage = message.site;
    stateManager.setSiteMode(siteMessage.mode);
  }

  startWSPingInterval(ws) {
    if (!ws) { return; }
    const id = setInterval(() => {
      if (!ws.isOpen) { clearInterval(id); }
      try {
        ws.ping('a', undefined, true); //eslint-disable-line no-undefined
      }
      catch (e) {
        log('ping failed', e);
      }
    }, Constants.WS_PING_TIMER);
  }
}
