import config from '../config/futurehome';
import simpleOauth from 'simple-oauth2';
import https from 'https';
import Passwords from '../config/password';
import { stateManager } from '../state/stateManager.js';
import WebSocket from 'ws';
import Constants from '../constants/index.js';

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
    const p = new Promise((resolve) => {
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
          const token = this.oauth.accessToken.create(result);
          this.token = token;
          resolve();
        });
    });
    return p;
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
    const ws = new WebSocket(this.createLivingroomMotionSensorStreamUrl());
    ws.on('message', this.processLivingroomMotionSensorStreamMessage);
    let start = 0;
    ws.on('open', () => {
      start = (new Date()).getTime();
      console.log('motiondetector stream connected');
    });

    ws.on('close', (code, reason) => {
      console.log('motiondetector stream disconnected', ((new Date()).getTime() - start ), code, reason);
    });
    this.startWSPingInterval(ws);
  }

  processLivingroomMotionSensorStreamMessage(data) {
    console.log('livingroom stream message', data);
  }

  createFutureHomeWsStreamUrl() {
    return `https://${config.apiBaseURL}${config.apiUrlPrefix}/sites/${config.mySiteId}/stream?access_token=${this.token.token.access_token}`;
  }

  subscribeToFutureHomeSiteStream() {
    const ws = new WebSocket(this.createFutureHomeWsStreamUrl());
    ws.on('message', this.processFutureHomeStreamMessage);
    let start = 0;
    ws.on('open', () => {
      start = (new Date()).getTime();
      console.log('site stream connected');
    });

    ws.on('close', (code, reason) => {
      console.log('site stream disconnected', ((new Date()).getTime() - start ), code, reason);
    });
    this.startWSPingInterval(ws);
  }

  processFutureHomeStreamMessage(data) {
    if (!data) { return; }
    console.log('processFutureHomeSiteStreamMessage', data);
    const message = JSON.parse(data);
    if (message.site) { this.processSiteMessage(message); }
    if (message.devices) { this.processDeviceMessage(message); }
    if (message.rooms) { this.processRoomMessage(message); }
  }

  processRoomMessage(message) {
    message.devices.forEach((device) => {
      if (device.temperature) { stateManager.setLivingroomTemperature(device.temperature); }
    });
  }

  processDeviceMessage(message) {
    message.rooms.forEach((room) => {
      if (room.current_temperature) { stateManager.setLivingroomTemperature(room.current_temperature); }
    });
  }

  processSiteMessage(message) {
    const siteMessage = message.site;
    stateManager.setSiteMode(siteMessage.mode);
  }

  startWSPingInterval(ws) {
    setInterval(() => {
      ws.ping('a');
    }, Constants.WS_PING_TIMER);
  }
}
