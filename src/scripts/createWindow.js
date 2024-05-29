import { BrowserWindow, shell } from 'electron';
import { join } from 'node:path';
import path from 'path';
import store from './genStore';

export const createWindow = async () => {
  console.log()
  let win = new BrowserWindow({
    width: store.get('bounds.width', 450),
    height: store.get('bounds.height', 450),
    x: store.get('bounds.x', null),
    y: store.get('bounds.y', null),
    autoHideMenuBar: true,
    frame: false,
    minHeight: 200,
    minWidth: 200,
    skipTaskbar: true,
    icon: path.join(__dirname, "../../src/assets/msn.ico"),
    webPreferences: {
      preload: join(__dirname, '/preload.js'),
      contextIsolation: true,
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
    win.setSkipTaskbar(false);
  } else {
    win.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  return win;
};