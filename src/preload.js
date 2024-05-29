// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
    addAnime: (day, title) => ipcRenderer.invoke('addAnime', day, title),
    getAnime: (uuid) => ipcRenderer.invoke('getAnime', uuid),
    getAnimes: () => ipcRenderer.invoke('getAnimes'),
    editAnime: (uuid, details) => ipcRenderer.invoke('editAnime', uuid, details),
    setPosition: (uuid, from, to) => ipcRenderer.invoke('setPosition', uuid, from, to),
    setContextualMenu: (uuid, x, y) => ipcRenderer.send('show-context-menu', uuid, x, y),
});