import React, { useState, useEffect } from 'react'
import { Cpu, Zap, HardDrive, BatteryCharging, Monitor, Layers } from 'lucide-react'

export const SystemWidget: React.FC = () => {
  const [cpu, setCpu] = useState(15)
  const [gpu, setGpu] = useState(11)
  const [memory, setMemory] = useState({ usedGB: 14.8, totalGB: 16, usedPercent: 62 })
  const [storage, setStorage] = useState({ freeGB: 26.3, totalGB: 245, usedGB: 218.7, usedPercent: 89 })
  const [battery, setBattery] = useState(94)

  useEffect(() => {
    // 1. Query real system metrics from Electron main process
    const fetchRealMetrics = async (): Promise<void> => {
      try {
        if (window.notchAPI?.getSystemInfo) {
          const info = await window.notchAPI.getSystemInfo()
          if (info.storage) {
            setStorage(info.storage)
          }
          if (info.memory) {
            setMemory(info.memory)
          }
        }
      } catch (err) {
        console.error('Failed to query system info:', err)
      }
    }

    fetchRealMetrics()
    const pollInterval = setInterval(fetchRealMetrics, 10000)

    // 2. Real-time dynamic activity simulation for CPU & GPU
    const activityInterval = setInterval(() => {
      setCpu(Math.floor(12 + Math.random() * 16))
      setGpu(Math.floor(8 + Math.random() * 14))
    }, 2500)

    return () => {
      clearInterval(pollInterval)
      clearInterval(activityInterval)
    }
  }, [])

  return (
    <div className="grid grid-cols-5 gap-2 w-full h-full px-1 py-1">
      {/* 1. CPU Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between text-neutral-400">
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-[10px] font-semibold tracking-wide text-neutral-300">CPU</span>
          </div>
          <span className="text-[9px] font-mono text-neutral-400">Apple M4</span>
        </div>
        <div className="my-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base font-bold text-white tracking-tight">{cpu}%</span>
            <span className="text-[9px] text-emerald-400 font-medium">Normal</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-400 rounded-full transition-all duration-500"
              style={{ width: `${cpu}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. GPU Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between text-neutral-400">
          <div className="flex items-center gap-1">
            <Monitor className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[10px] font-semibold tracking-wide text-neutral-300">GPU</span>
          </div>
          <span className="text-[9px] font-mono text-neutral-400">8-Core</span>
        </div>
        <div className="my-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base font-bold text-white tracking-tight">{gpu}%</span>
            <span className="text-[9px] text-amber-400 font-medium">Metal 4</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${gpu}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Memory Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between text-neutral-400">
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="text-[10px] font-semibold tracking-wide text-neutral-300">RAM</span>
          </div>
          <span className="text-[9px] font-mono text-neutral-400">{memory.totalGB} GB</span>
        </div>
        <div className="my-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base font-bold text-white tracking-tight">{memory.usedPercent}%</span>
            <span className="text-[9px] text-neutral-400 font-mono">{memory.usedGB} GB</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${memory.usedPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Storage Card (Menampilkan Sisa Storage) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between text-neutral-400">
          <div className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="text-[10px] font-semibold tracking-wide text-neutral-300">Disk</span>
          </div>
          <span className="text-[9px] font-mono text-rose-400 font-medium">Sisa</span>
        </div>
        <div className="my-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-bold text-white tracking-tight">{storage.freeGB} GB</span>
            <span className="text-[9px] text-neutral-400 font-mono">/{storage.totalGB}GB</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${storage.usedPercent}%` }}
              title={`Terpakai: ${storage.usedPercent}%`}
            />
          </div>
        </div>
      </div>

      {/* 5. Battery Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between text-neutral-400">
          <div className="flex items-center gap-1">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[10px] font-semibold tracking-wide text-neutral-300">Battery</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 fill-emerald-400" />
            Power
          </span>
        </div>
        <div className="my-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base font-bold text-white tracking-tight">{battery}%</span>
            <span className="text-[9px] text-emerald-400 font-medium">Charging</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${battery}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
