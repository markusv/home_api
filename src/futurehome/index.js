import config from '../config/futurehome';
import simpleOauth from 'simple-oauth2';
import https from 'https';
import Passwords from '../config/password';

// Get the access token object.
const tokenConfig = {
  username: config.username,
  password: Passwords.futureHome
};

export default class FutureHomeController {

  constructor() {
    this.oauth = simpleOauth.create(config.credentials);
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
}
