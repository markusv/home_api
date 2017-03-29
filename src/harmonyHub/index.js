import config from '../config/harmony';
import http from 'http';
import DeviceNames from '../constants/harmonyDeviceNames';
import HarmonyCommands from '../constants/harmonyCommands';
import HarmonyActivities from '../constants/harmonyActivities';

export default class HarmonyHub {

  turnOffEverything() {
    this.sendCommand(DeviceNames.RECEIVER, HarmonyCommands.POWER_OFF);
    this.sendCommand(DeviceNames.APPLE_TV_STUE, HarmonyCommands.POWER_OFF);
    this.sendCommand(DeviceNames.TV, HarmonyCommands.POWER_OFF);
    this.sendCommand(DeviceNames.PS4, HarmonyCommands.POWER_OFF);
//    this.sendCommand(DeviceNames.ALTIBOX, HarmonyCommands.POWER_TOGGLE);
  }

  listenToMusic() {
    this.sendActivityCommand(HarmonyActivities.LISTEN_TO_MUSIC);
  }

  watchAppleTv() {
    this.sendActivityCommand(HarmonyActivities.APPLE_TV);
  }

  sendActivityCommand(command) {
    const options = {
      host: `${config.serverName}`,
      port: 8282,
      path: `/hubs/${DeviceNames.HUB}/activities/${command}`,
      method: 'POST'
    };
    http.request(options).end();
  }

  sendCommand(slug, command) {
    const options = {
      host: `${config.serverName}`,
      port: 8282,
      path: `/hubs/${DeviceNames.HUB}/devices/${slug}/commands/${command}`,
      method: 'POST'
    };
    http.request(options).end();
  }
}

