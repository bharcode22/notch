import React, { useState, useEffect } from 'react'
import { Cpu, Zap, HardDrive, BatteryCharging } from 'lucide-react'

export const SystemWidget: React.FC = () => {
  const [cpu, setCpu] = useState(18)
  const [memory, setMemory] = useState(62)
  const [battery, setBattery] = useState(94)

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(12 + Math.random() * 15))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-3 gap-2.5 w-full h-full px-2 py-1">
      {/* CPU Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-medium tracking-wide">CPU</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">Apple Silicon</span>
        </div>
        <div className="my-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-lg font-bold text-white tracking-tight">{cpu}%</span>
            <span className="text-[10px] text-emerald-400">Normal</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-400 rounded-full transition-all duration-500"
              style={{ width: `${cpu}%` }}
            />
          </div>
        </div>
      </div>

      {/* Memory Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between text-neutral-400">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-medium tracking-wide">Memory</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">Unified</span>
        </div>
        <div className="my-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-lg font-bold text-white tracking-tight">{memory}%</span>
            <span className="text-[10px] text-neutral-400">9.9 / 16 GB</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${memory}%` }}
            />
          </div>
        </div>
      </div>

      {/* Battery Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between text-neutral-400">
          <div className="flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium tracking-wide">Battery</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 fill-emerald-400" />
            Power
          </span>
        </div>
        <div className="my-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-lg font-bold text-white tracking-tight">{battery}%</span>
            <span className="text-[10px] text-emerald-400">Charging</span>
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
