import { app, shell, BrowserWindow, screen, ipcMain } from 'electron'
import { join } from 'path'
import { existsSync, statfsSync } from 'fs'
import os from 'os'

const EXPANDED_WIDTH = 680
const EXPANDED_HEIGHT = 210
const TOP_OFFSET = 24 // Offset to push native top rounded corners offscreen, keeping top edge completely flat

let mainWindow: BrowserWindow | null = null
let isExpandedState = false

function getWindowBounds(): { x: number; y: number; width: number; height: number } {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { bounds } = primaryDisplay
  const x = Math.round(bounds.x + (bounds.width - EXPANDED_WIDTH) / 2)
  const y = bounds.y - TOP_OFFSET
  return { x, y, width: EXPANDED_WIDTH, height: EXPANDED_HEIGHT + TOP_OFFSET }
}

function updatePosition(win: BrowserWindow): void {
  win.setBounds(getWindowBounds())
}

function createWindow(): void {
  const initialBounds = getWindowBounds()
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
    resizable: false,
    movable: false,
    acceptFirstMouse: true,
    alwaysOnTop: true,
    hiddenInMissionControl: true,
    skipTaskbar: true,
    enableLargerThanScreen: true,
    roundedCorners: true,
    backgroundColor: '#00000000',
    visualEffectState: 'active',
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

  if (expanded) {
    mainWindow.setVibrancy('under-window')
    mainWindow.focus()
  } else {
    setTimeout(() => {
      if (!isExpandedState && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setVibrancy(null)
      }
    }, 200)
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
  let storage = {
    totalGB: 245,
    freeGB: 25.0,
    usedGB: 220.0,
    usedPercent: 89
  }

  try {
    const s = statfsSync('/')
    const total = (s.blocks * s.bsize) / (1024 ** 3)
    const free = (s.bavail * s.bsize) / (1024 ** 3)
    const used = total - free
    storage = {
      totalGB: Math.round(total),
      freeGB: parseFloat(free.toFixed(1)),
      usedGB: parseFloat(used.toFixed(1)),
      usedPercent: Math.round((used / total) * 100)
    }
  } catch (err) {
    console.error('Error fetching statfs:', err)
  }

  const totalMem = os.totalmem() / (1024 ** 3)
  const freeMem = os.freemem() / (1024 ** 3)
  const usedMem = totalMem - freeMem

  return {
    platform: process.platform,
    arch: process.arch,
    modelName: 'Apple M4',
    gpuModel: 'Apple M4',
    storage,
    memory: {
      totalGB: Math.round(totalMem),
      freeGB: parseFloat(freeMem.toFixed(1)),
      usedGB: parseFloat(usedMem.toFixed(1)),
      usedPercent: Math.round((usedMem / totalMem) * 100)
    }
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
