export interface StorageMetrics {
  totalGB: number
  freeGB: number
  usedGB: number
  usedPercent: number
}

export interface MemoryMetrics {
  totalGB: number
  freeGB: number
  usedGB: number
  usedPercent: number
}

export interface SystemMetrics {
  platform: string
  arch: string
  modelName?: string
  gpuModel?: string
  storage?: StorageMetrics
  memory?: MemoryMetrics
}

export interface NotchAPI {
  setExpanded: (expanded: boolean) => void
  setIgnoreMouseEvents: (ignore: boolean, forward?: boolean) => void
  getSystemInfo: () => Promise<SystemMetrics>
  quitApp: () => void
  onBlur?: (callback: () => void) => () => void
}

declare global {
  interface Window {
    notchAPI: NotchAPI
  }
}
