const { app, BrowserWindow, screen, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// ── Persist settings to userData/config.json ────────────────────────────────
const configPath = () => path.join(app.getPath('userData'), 'config.json');

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath(), 'utf8'));
  } catch {
    return { intervalMinutes: 30 };
  }
}

function saveConfig(data) {
  fs.writeFileSync(configPath(), JSON.stringify(data, null, 2));
}

// ── State ────────────────────────────────────────────────────────────────────
let overlayWindow = null;
let settingsWindow = null;
let tray = null;
let reminderTimer = null;
let config = loadConfig();

// ── Overlay ──────────────────────────────────────────────────────────────────
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
  overlayWindow.once('ready-to-show', () => overlayWindow.showInactive());
  overlayWindow.on('closed', () => { overlayWindow = null; });
}

function showReminder() {
  if (overlayWindow) return;
  createOverlay();
  setTimeout(() => { overlayWindow?.close(); }, 13000);
}

// ── Timer ────────────────────────────────────────────────────────────────────
function startTimer() {
  if (reminderTimer) clearInterval(reminderTimer);
  const ms = config.intervalMinutes * 60 * 1000;
  reminderTimer = setInterval(showReminder, ms);
}

// ── Settings window ──────────────────────────────────────────────────────────
function openSettings() {
  if (settingsWindow) { settingsWindow.focus(); return; }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 280,
    resizable: false,
    titleBarStyle: 'hiddenInset',
    title: 'Stand Up Break — Settings',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  settingsWindow.loadFile(path.join(__dirname, 'settings.html'));
  settingsWindow.on('closed', () => { settingsWindow = null; });
}

// ── IPC handlers ─────────────────────────────────────────────────────────────
ipcMain.handle('get-interval', () => config.intervalMinutes);

ipcMain.handle('set-interval', (_, minutes) => {
  config.intervalMinutes = minutes;
  saveConfig(config);
  startTimer(); // restart with new interval
});

// ── App ready ────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  const devIconPath = path.join(__dirname, '..', 'assets', 'tray-icon.png');
  const iconPath = fs.existsSync(devIconPath)
    ? devIconPath
    : path.join(process.resourcesPath, 'assets', 'tray-icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 22, height: 22 });
  tray = new Tray(trayIcon);
  tray.setToolTip('Stand Up Break');

  const buildMenu = () => Menu.buildFromTemplate([
    { label: `Remind every ${config.intervalMinutes} min`, enabled: false },
    { type: 'separator' },
    { label: 'Show Now', click: showReminder },
    { label: 'Settings…', click: openSettings },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);

  tray.setContextMenu(buildMenu());

  // Rebuild menu after settings change so interval label updates
  ipcMain.on('menu-refresh', () => tray.setContextMenu(buildMenu()));

  showReminder();   // show once on launch
  startTimer();
});

app.on('window-all-closed', (e) => e.preventDefault());
