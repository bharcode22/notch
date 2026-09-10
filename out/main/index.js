import { app, screen, BrowserWindow, ipcMain, shell } from "electron";
import { join } from "path";
import { existsSync } from "fs";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
const COLLAPSED_WIDTH = 185;
const COLLAPSED_HEIGHT = 34;
const EXPANDED_WIDTH = 680;
const EXPANDED_HEIGHT = 210;
let mainWindow = null;
let isExpandedState = false;
function getCollapsedBounds() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { bounds } = primaryDisplay;
  const x = Math.round(bounds.x + (bounds.width - COLLAPSED_WIDTH) / 2);
  const y = bounds.y;
  return { x, y, width: COLLAPSED_WIDTH, height: COLLAPSED_HEIGHT };
}
function getExpandedBounds() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { bounds } = primaryDisplay;
  const x = Math.round(bounds.x + (bounds.width - EXPANDED_WIDTH) / 2);
  const y = bounds.y;
  return { x, y, width: EXPANDED_WIDTH, height: EXPANDED_HEIGHT };
}
function updatePosition(win) {
  const bounds = isExpandedState ? getExpandedBounds() : getCollapsedBounds();
  win.setBounds(bounds);
}
function createWindow() {
  const initialBounds = getCollapsedBounds();
  const preloadPath = existsSync(join(__dirname, "../preload/index.mjs")) ? join(__dirname, "../preload/index.mjs") : join(__dirname, "../preload/index.js");
  console.log("[Main Process] Initializing window with bounds:", initialBounds);
  console.log("[Main Process] Loading preload script from:", preloadPath);
  mainWindow = new BrowserWindow({
    ...initialBounds,
    show: false,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: true,
    movable: false,
    acceptFirstMouse: true,
    alwaysOnTop: true,
    hiddenInMissionControl: true,
    skipTaskbar: true,
    enableLargerThanScreen: true,
    roundedCorners: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: preloadPath,
      sandbox: false,
      contextIsolation: true,
      backgroundThrottling: false
    }
  });
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setAlwaysOnTop(true, "status", 1);
  mainWindow.on("ready-to-show", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setBounds(initialBounds);
      mainWindow.show();
    }
  });
  mainWindow.on("blur", () => {
    if (isExpandedState && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("notch-blur");
    }
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}
app.whenReady().then(() => {
  if (process.platform === "darwin") {
    app.dock?.hide();
  }
  createWindow();
  screen.on("display-metrics-changed", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      updatePosition(mainWindow);
    }
  });
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
ipcMain.on("set-notch-expanded", (_event, expanded) => {
  console.log("[Main Process] set-notch-expanded -> expanded:", expanded);
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (isExpandedState === expanded) return;
  isExpandedState = expanded;
  const bounds = expanded ? getExpandedBounds() : getCollapsedBounds();
  console.log("[Main Process] Window setBounds ->", bounds);
  mainWindow.setBounds(bounds);
  if (expanded) {
    mainWindow.focus();
  }
});
ipcMain.on("set-ignore-mouse-events", (event, ignore, forward = true) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) {
    if (ignore) {
      win.setIgnoreMouseEvents(true, { forward: !!forward });
    } else {
      win.setIgnoreMouseEvents(false);
    }
  }
});
ipcMain.handle("get-system-info", () => {
  return {
    platform: process.platform,
    arch: process.arch
  };
});
ipcMain.on("quit-app", () => {
  app.quit();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
