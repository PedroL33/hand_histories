import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { registerUploadHandler } from './ipcHandlers/UploadHandler';
import { registerGetHandsHandler } from './ipcHandlers/GetHandHandler';

const isProd: boolean = process.env.NODE_ENV === 'production';
if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}
(async () => {
  await app.whenReady();
  registerUploadHandler();
  registerGetHandsHandler();
  const mainWindow = createWindow('main', {
    width: 1200,
    height: 700,
    minWidth: 1200,
    minHeight: 700,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});