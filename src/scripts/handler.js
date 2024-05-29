import { Menu, ipcMain, BrowserWindow } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import store from './genStore';

const getAnimeByUuid = (uuid) => {
    for (const day of Object.keys(store.get('animes'))) {
        const details = store.get(`animes.${day}`).find(anime => anime.uuid === uuid);
        if (details) {
            return { day, details };
        }
    }
    return null;
}

const getAnimeIndexByUuid = (uuid) => {
    const { day } = getAnimeByUuid(uuid);
    const animesStore = store.get(`animes.${day}`);
    return animesStore.findIndex(anime => anime.uuid === uuid);
}

export default () => {
    ipcMain.handle('addAnime', (_, day, title) => {
        store.set(`animes.${day}`, [
            ...(store.get(`animes.${day}`) || []),
            {
                uuid: uuidv4(),
                title,
                episodes: 0,
            }
        ]);
    });


    ipcMain.handle('getAnimes', () => {
        return store.get('animes');
    });


    ipcMain.handle('getAnime', (_, uuid) => {
        const { day, details } = getAnimeByUuid(uuid);
        return {
            day,
            ...details,
        };
    });


    ipcMain.handle('editAnime', (_, uuid, newDetails) => {
        const { day, details } = getAnimeByUuid(uuid);
        if (newDetails.day && day != newDetails.day) {
            const animesStoreDay = store.get(`animes.${day}`);
            const animeIdxDay = animesStoreDay.findIndex(anime => anime.uuid === uuid);
            animesStoreDay.splice(animeIdxDay, 1);
            store.set(`animes.${day}`, animesStoreDay);

            const animesStore = store.get(`animes.${newDetails.day}`);
            animesStore.push({
                uuid: details.uuid,
                title: newDetails.title ?? details.title,
                episodes: newDetails.episodes ?? details.episodes,
            });
            store.set(`animes.${newDetails.day || day}`, animesStore);
        } else {
            const animesStore = store.get(`animes.${day}`);
            const animeIdx = animesStore.findIndex(anime => anime.uuid === uuid);
            animesStore[animeIdx] = {
                uuid: details.uuid,
                title: newDetails.title ?? details.title,
                episodes: newDetails.episodes ?? details.episodes,
            };
            store.set(`animes.${day}`, animesStore);
        }
    });

    ipcMain.handle('setPosition', (_, uuid, from, to) => {
        if (from.day === to.day && from.position === to.position) {
            return;
        }

        let animesStore = store.get(`animes.${from.day}`);
        const animeIdx = animesStore.findIndex(anime => anime.uuid === uuid);
        const animeToChangePosition = animesStore.splice(animeIdx, 1)[0];
        store.set(`animes.${from.day}`, animesStore);

        if (from.day !== to.day) {
            animesStore = store.get(`animes.${to.day}`);
        }
        animesStore.splice(to.position, 0, animeToChangePosition);
        store.set(`animes.${to.day}`, animesStore);
    });


    ipcMain.on('show-context-menu', (_, uuid, x, y) => {
        let window = BrowserWindow.getFocusedWindow();
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Éditer',
                click: () => {
                    window.webContents.executeJavaScript(`window.setEditedAnime('${uuid}');`);
                }
            },
            {
                label: 'Supprimer',
                click: () => {
                    const { day } = getAnimeByUuid(uuid);
                    const animesStore = store.get(`animes.${day}`);
                    const animeIdx = animesStore.findIndex(anime => anime.uuid === uuid);
                    animesStore.splice(animeIdx, 1);
                    store.set(`animes.${day}`, animesStore);
                    window.webContents.executeJavaScript("window.refreshList();");
                }
            }
        ]);

        contextMenu.popup({ window, x, y });
    });
};