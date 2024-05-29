import { app } from 'electron';
import appEvent from './scripts/appEvent.js';
import handler from './scripts/handler.js';
const AutoLaunch = require('auto-launch');

const pathExe = app.getPath('exe');
const autoLauncher = new AutoLaunch({
  name: 'Seasonal Animes',
  path: app.getPath('exe'),
});

autoLauncher.enable();

autoLauncher.isEnabled()
  .then(function (isEnabled) {
    if (isEnabled) {
      return;
    }
    autoLauncher.enable();
  })
  .catch(function (err) {
    // handle error
  });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// OR Check if single instance, if not, simply quit new instance
if (require('electron-squirrel-startup') || !app.requestSingleInstanceLock()) {
  app.quit();
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
appEvent();
handler();