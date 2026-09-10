import React, { useState, useEffect, useRef } from 'react'
import { MediaWidget } from './components/MediaWidget'
import { SystemWidget } from './components/SystemWidget'
import { QuickActionsWidget } from './components/QuickActionsWidget'
import { Music2, Activity, Radio, X } from 'lucide-react'

type TabType = 'media' | 'system' | 'actions'

export default function App(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('media')

  const isOpenRef = useRef(isOpen)
  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  // Open the notch island
  const handleOpen = (e?: React.MouseEvent): void => {
    if (e) e.stopPropagation()
    if (isOpen) return

    window.notchAPI?.setIgnoreMouseEvents(false)
    window.notchAPI?.setExpanded(true)
    setIsOpen(true)
  }

  // Close the notch island smoothly
  const handleClose = (e?: React.MouseEvent): void => {
    if (e) e.stopPropagation()
    if (!isOpenRef.current) return

    setIsOpen(false)
    window.notchAPI?.setExpanded(false)
    setTimeout(() => {
      if (!isOpenRef.current) {
        window.notchAPI?.setIgnoreMouseEvents(true, true)
      }
    }, 200)
  }

  // Setup click-through on mount
  useEffect(() => {
    window.notchAPI?.setIgnoreMouseEvents(true, true)
  }, [])

  // Auto-close when clicking outside (window blur)
  useEffect(() => {
    const onWindowBlur = (): void => {
      if (isOpenRef.current) {
        handleClose()
      }
    }

    const cleanupBlur = window.notchAPI?.onBlur ? window.notchAPI.onBlur(onWindowBlur) : undefined

    return () => {
      if (cleanupBlur) cleanupBlur()
    }
  }, [])

  return (
    <div
      className="w-full h-full flex justify-center items-start overflow-hidden select-none pt-[24px]"
      onMouseEnter={() => {
        if (!isOpenRef.current) {
          window.notchAPI?.setIgnoreMouseEvents(true, true)
        }
      }}
    >
      {/* Notch Container: When expanded, background & blur come 100% from Electron native window */}
      <div
        onMouseEnter={() => {
          window.notchAPI?.setIgnoreMouseEvents(false)
        }}
        onMouseLeave={() => {
          if (!isOpenRef.current) {
            window.notchAPI?.setIgnoreMouseEvents(true, true)
          }
        }}
        className={`select-none text-white relative overflow-hidden flex flex-col justify-start items-center transition-all duration-200 ${isOpen
          ? 'w-[680px] h-[210px] rounded-b-[24px]'
          : 'w-[175px] h-[32px] rounded-b-[9px] cursor-pointer'
          }`}
      >
        {/* COLLAPSED VIEW: Resting inside MacBook Camera Notch */}
        <div
          onClick={handleOpen}
          className={`bg-black absolute inset-0 w-full h-full flex items-center justify-between px-3 text-neutral-300 cursor-pointer transition-all ${isOpen
            ? 'opacity-0 pointer-events-none scale-90 duration-150 ease-out'
            : 'opacity-100 pointer-events-auto scale-100 duration-200 delay-100 ease-out'
            }`}
        >

        </div>

        {/* EXPANDED VIEW: Dynamic Island Control Panel */}
        <div
          className={`absolute inset-0 w-full h-full flex flex-col pt-7 px-4 pb-3 ${isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none scale-95 duration-150 delay-0 ease-in'
            }`}
        >
          {/* Top Navigation & Controls */}
          <div className="flex items-center justify-center w-full pb-2 mb-2 border-b border-white/10 mt-5 px-1">
            <div className="w-6" />
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded-full">
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
