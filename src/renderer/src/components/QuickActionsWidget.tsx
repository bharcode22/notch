import React, { useState } from 'react'
import { Moon, Mic, MicOff, Sun, Power, Sliders } from 'lucide-react'

export const QuickActionsWidget: React.FC = () => {
  const [dnd, setDnd] = useState(false)
  const [micMuted, setMicMuted] = useState(false)
  const [trueTone, setTrueTone] = useState(true)

  const handleQuit = (): void => {
    if (window.notchAPI?.quitApp) {
      window.notchAPI.quitApp()
    } else {
      console.log('Quit triggered')
    }
  }

  return (
    <div className="flex flex-col justify-between w-full h-full px-2 py-1">

      <p>hallo world</p>

      {/* Footer / Utilities */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-neutral-400 text-xs">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
          <Sliders className="w-3.5 h-3.5" />
          <span>macOS Notch Companion • v1.0.0</span>
        </div>

        <button
          onClick={handleQuit}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors"
          title="Quit Notch App"
        >
          <Power className="w-3 h-3" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  )
}
