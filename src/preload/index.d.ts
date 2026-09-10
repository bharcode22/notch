export interface NotchAPI {
  setExpanded: (expanded: boolean) => void
  setIgnoreMouseEvents: (ignore: boolean, forward?: boolean) => void
  getSystemInfo: () => Promise<{ platform: string; arch: string }>
  quitApp: () => void
  onBlur?: (callback: () => void) => () => void
}

declare global {
  interface Window {
    notchAPI: NotchAPI
  }
}
