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
        path: `/api/v2/sites/${config.mySiteId}`,
        method: 'PATCH',
        headers: this.createHeaders()
      };
      const req = https.request(options);
      req.write(`mode=${mode}`);
      req.end();
    });
  }

  createHeaders() {
    return {
      Authorization: `Bearer ${this.token.token.access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
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
