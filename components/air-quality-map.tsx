"use client"

import { useRef } from "react"

interface City {
  id: string
  name: string
  coords: [number, number]
}

interface AirQualityMapProps {
  city?: City
  splitPosition: number
  zoomLevel: number
  isProcessing: boolean
}

export function AirQualityMap({ city, splitPosition, zoomLevel, isProcessing }: AirQualityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  // Simulate different data quality levels
  const generateHeatmapData = (isEnhanced: boolean) => {
    const gridSize = isEnhanced ? 20 : 8
    const data = []

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const baseValue = Math.random() * 200 + 50
        const variation = isEnhanced ? Math.random() * 40 - 20 : Math.random() * 80 - 40
        const aqi = Math.max(0, Math.min(300, baseValue + variation))

        data.push({
          x: (i / gridSize) * 100,
          y: (j / gridSize) * 100,
          aqi: aqi,
          color: getAQIColor(aqi),
        })
      }
    }

    return data
  }

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981" // Green
    if (aqi <= 100) return "#f59e0b" // Yellow
    if (aqi <= 150) return "#f97316" // Orange
    if (aqi <= 200) return "#ef4444" // Red
    if (aqi <= 300) return "#8b5cf6" // Purple
    return "#7c2d12" // Maroon
  }

  const satelliteData = generateHeatmapData(false)
  const enhancedData = generateHeatmapData(true)

  return (
    <div ref={mapRef} className="relative w-full h-full bg-slate-800">
      {/* Satellite Data Side */}
      <div className="absolute top-0 left-0 bottom-0 overflow-hidden" style={{ width: `${splitPosition}%` }}>
        <div className="relative w-full h-full">
          {/* Blocky satellite data visualization */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {satelliteData.map((point, index) => (
              <rect
                key={`sat-${index}`}
                x={point.x}
                y={point.y}
                width={100 / 8}
                height={100 / 8}
                fill={point.color}
                opacity={0.7}
              />
            ))}
          </svg>

          {/* City marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-white rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* AI-Enhanced Data Side */}
      <div className="absolute top-0 right-0 bottom-0 overflow-hidden" style={{ width: `${100 - splitPosition}%` }}>
        <div className="relative w-full h-full">
          {/* High-resolution enhanced data */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {enhancedData.map((point, index) => (
              <circle
                key={`enh-${index}`}
                cx={point.x + 2.5}
                cy={point.y + 2.5}
                r={2}
                fill={point.color}
                opacity={0.8}
              />
            ))}
          </svg>

          {/* Street-level details overlay */}
          <div className="absolute inset-0">
            {/* Simulated street grid */}
            <svg className="w-full h-full opacity-30" viewBox="0 0 100 100">
              {Array.from({ length: 10 }).map((_, i) => (
                <g key={i}>
                  <line x1={i * 10} y1={0} x2={i * 10} y2={100} stroke="#64748b" strokeWidth={0.2} />
                  <line x1={0} y1={i * 10} x2={100} y2={i * 10} stroke="#64748b" strokeWidth={0.2} />
                </g>
              ))}
            </svg>
          </div>

          {/* City marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-sm text-cyan-400">AI Enhancement in Progress...</div>
          </div>
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 px-2 py-1 rounded text-xs">Zoom: {zoomLevel}km</div>

      {/* Confidence zones indicator */}
      <div className="absolute bottom-4 right-4 bg-slate-900/80 px-2 py-1 rounded text-xs">Confidence: ±15%</div>
    </div>
  )
}
