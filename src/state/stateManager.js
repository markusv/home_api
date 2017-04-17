import WebSocket from 'ws';
import config from '../config/index.js';

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
  }

  createWsServer() {
    this.wss = new WebSocket.Server({ port: config.wsPort });
    this.wss.on('connection', () => {
      console.log('new connection');
    });
  }

  setSiteMode(mode) {
    const oldMode = dataModel.futurehome.mode;
    dataModel.futurehome.mode = mode;
    if (mode !== oldMode) {
      this.notifyClientsFHModeChange(mode);
    }
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
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

export const stateManager = new StateManager();
