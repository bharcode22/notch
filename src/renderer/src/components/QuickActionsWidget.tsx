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
      <div className="grid grid-cols-3 gap-2.5">
        {/* Do Not Disturb Toggle */}
        <button
          onClick={() => setDnd(!dnd)}
          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${dnd
            ? 'bg-purple-600/30 border-purple-500/50 text-white'
            : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
            }`}
        >
          <Moon className={`w-4 h-4 ${dnd ? 'text-purple-400 fill-purple-400' : 'text-neutral-400'}`} />
          <div className="text-left">
            <div className="text-[11px] font-medium leading-none">Focus</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">{dnd ? 'Active' : 'Off'}</div>
          </div>
        </button>

        {/* Mic Mute Toggle */}
        <button
          onClick={() => setMicMuted(!micMuted)}
          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${micMuted
            ? 'bg-red-500/30 border-red-500/50 text-white'
            : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
            }`}
        >
          {micMuted ? (
            <MicOff className="w-4 h-4 text-red-400" />
          ) : (
            <Mic className="w-4 h-4 text-neutral-400" />
          )}
          <div className="text-left">
            <div className="text-[11px] font-medium leading-none">Microphone</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">{micMuted ? 'Muted' : 'Live'}</div>
          </div>
        </button>

        {/* True Tone Toggle */}
        <button
          onClick={() => setTrueTone(!trueTone)}
          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${trueTone
            ? 'bg-amber-500/20 border-amber-500/40 text-white'
            : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
            }`}
        >
          <Sun className={`w-4 h-4 ${trueTone ? 'text-amber-400' : 'text-neutral-400'}`} />
          <div className="text-left">
            <div className="text-[11px] font-medium leading-none">True Tone</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">{trueTone ? 'On' : 'Off'}</div>
          </div>
        </button>
      </div>

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
