import { contextBridge, ipcRenderer } from 'electron'

export interface NotchAPI {
  setExpanded: (expanded: boolean) => void
  setIgnoreMouseEvents: (ignore: boolean, forward?: boolean) => void
  getSystemInfo: () => Promise<{ platform: string; arch: string }>
  quitApp: () => void
  onBlur?: (callback: () => void) => () => void
}

const notchAPI: NotchAPI = {
  setExpanded: (expanded: boolean): void => {
    ipcRenderer.send('set-notch-expanded', expanded)
  },
  setIgnoreMouseEvents: (ignore: boolean, forward = false): void => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, forward)
  },
  getSystemInfo: (): Promise<{ platform: string; arch: string }> => {
    return ipcRenderer.invoke('get-system-info')
  },
  quitApp: (): void => {
    ipcRenderer.send('quit-app')
  },
  onBlur: (callback: () => void): (() => void) => {
    const handler = (): void => callback()
    ipcRenderer.on('notch-blur', handler)
    return () => {
      ipcRenderer.removeListener('notch-blur', handler)
    }
  }
}

try {
  contextBridge.exposeInMainWorld('notchAPI', notchAPI)
} catch (error) {
  console.error('Failed to expose notchAPI into renderer context:', error)
}
