const { app, BrowserWindow, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let overlayWindow = null;
let tray = null;
let reminderInterval = null;

const REMINDER_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

function createOverlay() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  overlayWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  overlayWindow.setIgnoreMouseEvents(true);
  overlayWindow.loadFile(path.join(__dirname, 'overlay.html'));

  // Close overlay after animation completes (~6 seconds)
  overlayWindow.once('ready-to-show', () => {
    overlayWindow.showInactive();
  });

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
}

function showReminder() {
  if (overlayWindow) return; // already showing
  createOverlay();

  setTimeout(() => {
    if (overlayWindow) {
      overlayWindow.close();
    }
  }, 13000);
}

function startTimer() {
  showReminder(); // show once immediately on launch
  reminderInterval = setInterval(showReminder, REMINDER_INTERVAL_MS);
}

app.whenReady().then(() => {
  // Tray icon (blank 1x1 so we don't need an icon file to start)
  const emptyIcon = nativeImage.createEmpty();
  tray = new Tray(emptyIcon);
  tray.setToolTip('Stand Up Break');

  const menu = Menu.buildFromTemplate([
    { label: 'Show Now', click: showReminder },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);
  tray.setContextMenu(menu);

  startTimer();
});

app.on('window-all-closed', (e) => {
  // Keep app running even when all windows are closed
  e.preventDefault();
});
