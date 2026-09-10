import React, { useState, useEffect, useRef } from 'react'
import { MediaWidget } from './components/MediaWidget'
import { SystemWidget } from './components/SystemWidget'
import { QuickActionsWidget } from './components/QuickActionsWidget'
import { Music2, Activity, Radio, X } from 'lucide-react'

type TabType = 'media' | 'system' | 'actions'

export default function App(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('media')
  const [currentTime, setCurrentTime] = useState<string>('')

  const isOpenRef = useRef(isOpen)
  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  // Live time ticker
  useEffect(() => {
    const update = (): void => {
      const d = new Date()
      setCurrentTime(
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  // Open the notch island
  const handleOpen = (e?: React.MouseEvent): void => {
    if (e) e.stopPropagation()
    if (isOpen) return

    // 1. Expand the native window in main process first
    window.notchAPI?.setExpanded(true)
    // 2. Trigger opening animation in next microtask
    requestAnimationFrame(() => {
      setIsOpen(true)
    })
  }

  // Close the notch island smoothly
  const handleClose = (): void => {
    if (!isOpenRef.current) return
    setIsOpen(false)
    setTimeout(() => {
      if (!isOpenRef.current) {
        window.notchAPI?.setExpanded(false)
      }
    }, 380)
  }

  // Auto-close when clicking outside (window blur)
  useEffect(() => {
    const onWindowBlur = (): void => {
      if (isOpenRef.current) {
        handleClose()
      }
    }

    window.addEventListener('blur', onWindowBlur)
    const cleanupBlur = window.notchAPI?.onBlur ? window.notchAPI.onBlur(onWindowBlur) : undefined

    return () => {
      window.removeEventListener('blur', onWindowBlur)
      if (cleanupBlur) cleanupBlur()
    }
  }, [])

  return (
    <div className="w-full h-full flex justify-center items-start overflow-hidden select-none bg-transparent">
      {/* Dynamic Morphing Notch Container */}
      <div
        className={`select-none notch-spring text-white relative overflow-hidden flex flex-col justify-start items-center ${isOpen
          ? 'w-[680px] h-[210px] rounded-b-[28px] bg-black/90 border-b border-x border-white/15'
          : 'w-[185px] h-[34px] rounded-b-[14px] bg-black/90 border-b border-x border-white/15 hover:bg-neutral-900/95 cursor-pointer'
          }`}
      >
        {/* COLLAPSED VIEW: Resting inside MacBook Camera Notch */}
        <div
          onClick={handleOpen}
          className={`absolute inset-0 w-full h-full flex items-center justify-between px-3 text-neutral-300 cursor-pointer transition-all ${isOpen
            ? 'opacity-0 pointer-events-none scale-90 duration-150 ease-out'
            : 'opacity-100 pointer-events-auto scale-100 duration-200 delay-100 ease-out'
            }`}
          title="Klik untuk membuka Notch Companion"
        >
          {/* Left: Indicator dot & music icon */}
          <div className="flex items-center gap-1.5 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle" />
            <Music2 className="w-3.5 h-3.5 text-neutral-300" />
          </div>

          {/* Center: Live Clock */}
          <span className="text-[11px] font-mono font-medium text-neutral-200 tabular-nums tracking-wider pointer-events-none">
            {currentTime || '12:00'}
          </span>

          {/* Right: Sound Wave Bars */}
          <div className="flex items-center gap-0.5 pointer-events-none">
            <span className="w-0.5 h-2 bg-emerald-400/80 rounded-full animate-wave-1" />
            <span className="w-0.5 h-3 bg-emerald-400/80 rounded-full animate-wave-2" />
            <span className="w-0.5 h-1.5 bg-emerald-400/80 rounded-full animate-wave-3" />
          </div>
        </div>

        {/* EXPANDED VIEW: Dynamic Island Control Panel */}
        <div
          className={`absolute inset-0 w-full h-full flex flex-col pt-7 px-4 pb-3 transition-all ${isOpen
            ? 'opacity-100 pointer-events-auto scale-100 duration-250 delay-100 ease-out'
            : 'opacity-0 pointer-events-none scale-95 duration-150 delay-0 ease-in'
            }`}
        >
          {/* Top Navigation & Controls */}
          <div className="flex items-center justify-center w-full pb-2 mb-2 border-b border-white/10 mt-5">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 p-0.5 rounded-full">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab('media')
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${activeTab === 'media'
                  ? 'bg-white/20 text-white border border-white/15 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Music2 className="w-3.5 h-3.5 pointer-events-none" />
                <span className="pointer-events-none">Media</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab('system')
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${activeTab === 'system'
                  ? 'bg-white/20 text-white border border-white/15 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Activity className="w-3.5 h-3.5 pointer-events-none" />
                <span className="pointer-events-none">System</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab('actions')
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${activeTab === 'actions'
                  ? 'bg-white/20 text-white border border-white/15 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Radio className="w-3.5 h-3.5 pointer-events-none" />
                <span className="pointer-events-none">Actions</span>
              </button>
            </div>
          </div>

          {/* Body Content based on Active Tab */}
          <div className="flex-1 min-h-0">
            {activeTab === 'media' && <MediaWidget />}
            {activeTab === 'system' && <SystemWidget />}
            {activeTab === 'actions' && <QuickActionsWidget />}
          </div>
        </div>
      </div>
    </div>
  )
}
