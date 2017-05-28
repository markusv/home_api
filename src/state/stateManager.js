import WebSocket from 'ws';
import config from '../config/index.js';
import Constants from '../constants/index.js';
import { log } from '../server/logger';

const dataModel = {
  futurehome: {
    mode: '',
    temperature: {
      livingroom: 0
    }
  }
};

class StateManager {
  constructor() {
    this.createWsServer();
    this.pingClients();
  }

  createWsServer() {
    this.wss = new WebSocket.Server({ port: config.wsPort });
    this.wss.on('connection', () => {
      log('new connection');
    });
  }

  getSiteMode() {
    return dataModel.futurehome.mode;
  }

  setSiteMode(mode) {
    const oldMode = dataModel.futurehome.mode;
    dataModel.futurehome.mode = mode;
    if (mode !== oldMode) {
      this.notifyClientsFHModeChange(mode);
    }
  }

  getLivingroomTemperature() {
    return dataModel.futurehome.temperature.livingroom;
  }

  setLivingroomTemperature(temp) {
    const oldTemp = dataModel.futurehome.temperature.livingroom;
    dataModel.futurehome.temperature.livingroom = temp;
    if (oldTemp !== temp) {
      this.notifyClientsLivingroomTempChanged(temp);
    }
  }

  notifyClientsLivingroomTempChanged(temp) {
    this.notifyClients({type: 'livingroomTempChanged', temperature: temp});
  }

  notifyClientsFHModeChange(mode) {
    this.notifyClients({type: 'futurehomeModeChange', mode});
  }

  notifyClients(data) {
    log('notifyCliens', JSON.stringify(data));
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  pingClients() {
    if (!this.wss) { return; }
    setInterval(() => {
      this.wss.clients.forEach((client) => {
        client.ping('ping');
      });
    }, Constants.WS_PING_TIMER);
  }
}

export const stateManager = new StateManager();
