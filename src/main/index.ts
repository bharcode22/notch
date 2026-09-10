import { app, shell, BrowserWindow, screen, ipcMain } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'

const COLLAPSED_WIDTH = 185
const COLLAPSED_HEIGHT = 34
const EXPANDED_WIDTH = 680
const EXPANDED_HEIGHT = 210

let mainWindow: BrowserWindow | null = null
let isExpandedState = false

function getCollapsedBounds(): { x: number; y: number; width: number; height: number } {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { bounds } = primaryDisplay
  const x = Math.round(bounds.x + (bounds.width - COLLAPSED_WIDTH) / 2)
  const y = bounds.y
  return { x, y, width: COLLAPSED_WIDTH, height: COLLAPSED_HEIGHT }
}

function getExpandedBounds(): { x: number; y: number; width: number; height: number } {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { bounds } = primaryDisplay
  const x = Math.round(bounds.x + (bounds.width - EXPANDED_WIDTH) / 2)
  const y = bounds.y
  return { x, y, width: EXPANDED_WIDTH, height: EXPANDED_HEIGHT }
}

function updatePosition(win: BrowserWindow): void {
  const bounds = isExpandedState ? getExpandedBounds() : getCollapsedBounds()
  win.setBounds(bounds)
}

function createWindow(): void {
  const initialBounds = getCollapsedBounds()
  const preloadPath = existsSync(join(__dirname, '../preload/index.mjs'))
    ? join(__dirname, '../preload/index.mjs')
    : join(__dirname, '../preload/index.js')

  console.log('[Main Process] Initializing window with bounds:', initialBounds)
  console.log('[Main Process] Loading preload script from:', preloadPath)

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
    backgroundColor: '#00000000',
    webPreferences: {
      preload: preloadPath,
      sandbox: false,
      contextIsolation: true,
      backgroundThrottling: false
    }
  })

  // Ensure it floats above full screen apps & menu bar
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  mainWindow.setAlwaysOnTop(true, 'status', 1)

  mainWindow.on('ready-to-show', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setBounds(initialBounds)
      mainWindow.show()
    }
  })

  // When clicking outside, inform renderer to collapse smoothly
  mainWindow.on('blur', () => {
    if (isExpandedState && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('notch-blur')
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load renderer
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// App lifecycle
app.whenReady().then(() => {
  // Hide from Dock for clean macOS status/notch daemon look
  if (process.platform === 'darwin') {
    app.dock?.hide()
  }

  createWindow()

  // Update position if screen resolution changes
  screen.on('display-metrics-changed', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      updatePosition(mainWindow)
    }
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// IPC Listeners
ipcMain.on('set-notch-expanded', (_event, expanded: boolean) => {
  console.log('[Main Process] set-notch-expanded -> expanded:', expanded)
  if (!mainWindow || mainWindow.isDestroyed()) return
  if (isExpandedState === expanded) return
  isExpandedState = expanded

  const bounds = expanded ? getExpandedBounds() : getCollapsedBounds()
  console.log('[Main Process] Window setBounds ->', bounds)
  mainWindow.setBounds(bounds)

  if (expanded) {
    mainWindow.focus()
  }
})

ipcMain.on('set-ignore-mouse-events', (event, ignore: boolean, forward = true) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win && !win.isDestroyed()) {
    if (ignore) {
      win.setIgnoreMouseEvents(true, { forward: !!forward })
    } else {
      win.setIgnoreMouseEvents(false)
    }
  }
})

ipcMain.handle('get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch
  }
})

ipcMain.on('quit-app', () => {
  app.quit()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
