import { app, BrowserWindow } from 'electron';
import { createWindow } from './createWindow';
import store from './genStore';

export default () => {
    // Behaviour on second instance for parent process
    app.on('second-instance', () => {
        if (BrowserWindow) {
            const allWindows = BrowserWindow.getAllWindows();
            allWindows[0].focus();
        }
    })

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', async () => {
        const win = await createWindow();
        console.log(win.getBounds(), store.get('bounds'))
        win.on('move', () => {
            store.set('bounds', win.getBounds());
        });
        win.on('resized', () => {
            store.set('bounds', win.getBounds());
        });

        win.on('close', () => {
            store.set('bounds', win.getBounds());
        });

        // const sourceFilePath = path.join(__dirname, 'styles', 'custom_style.css');
        // const appDataPath = app.getPath('userData');
        // const destinationFilePath = path.join(appDataPath, 'custom_style.css');

        // if (!fs.existsSync(appDataPath)) {
        //     fs.mkdirSync(appDataPath, { recursive: true });
        // }

        // fs.copyFileSync(sourceFilePath, destinationFilePath);
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        const allWindows = BrowserWindow.getAllWindows()
        if (allWindows.length) {
            allWindows[0].focus()
        } else {
            createWindow()
        }
    });
};