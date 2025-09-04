"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, Share2, Play, Pause, Layers, MapPin, Satellite, Building2 } from "lucide-react"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => ({ default: mod.MapContainer })), {
  ssr: false,
})
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => ({ default: mod.TileLayer })), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => ({ default: mod.Marker })), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => ({ default: mod.Popup })), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then((mod) => ({ default: mod.Circle })), { ssr: false })

interface MonitoringStation {
  id: string
  name: string
  position: [number, number]
  aqi: number
  pollutants: {
    pm25: number
    pm10: number
    no2: number
    o3: number
  }
  lastUpdated: string
  type: "government" | "industrial" | "residential" | "traffic"
  city: string
}

interface HeatmapPoint {
  position: [number, number]
  aqi: number
  intensity: number
}

interface LeafletAirQualityMapProps {
  center?: [number, number]
  zoom?: number
  className?: string
}

function MapComponent({
  center,
  zoom,
  selectedPollutant,
  mapLayer,
  timeHour,
  onStationSelect,
}: {
  center: [number, number]
  zoom: number
  selectedPollutant: string
  mapLayer: string
  timeHour: number
  onStationSelect: (station: MonitoringStation) => void
}) {
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      try {
        // Load CSS first
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          link.crossOrigin = ""
          document.head.appendChild(link)
        }

        // Load Leaflet JS
        if (!window.L) {
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          script.crossOrigin = ""

          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        if (window.L) {
          delete (window.L.Icon.Default.prototype as any)._getIconUrl
          window.L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          })
        }

        setLeafletLoaded(true)
        setTimeout(() => setMapReady(true), 100)
      } catch (error) {
        console.error("[v0] Failed to load Leaflet:", error)
      }
    }

    loadLeaflet()
  }, [])

  const monitoringStations: MonitoringStation[] = [
    // Mumbai Region
    {
      id: "mumbai-1",
      name: "Mumbai Central Air Quality Station",
      position: [19.076, 72.8777],
      aqi: 156,
      pollutants: { pm25: 68, pm10: 89, no2: 45, o3: 78 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "government",
      city: "Mumbai",
    },
    {
      id: "mumbai-2",
      name: "Bandra-Kurla Complex Industrial Monitor",
      position: [19.0596, 72.8656],
      aqi: 142,
      pollutants: { pm25: 62, pm10: 82, no2: 38, o3: 71 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "industrial",
      city: "Mumbai",
    },
    {
      id: "mumbai-3",
      name: "Andheri East Residential Area",
      position: [19.1136, 72.8697],
      aqi: 134,
      pollutants: { pm25: 58, pm10: 76, no2: 42, o3: 68 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "residential",
      city: "Mumbai",
    },
    {
      id: "thane-1",
      name: "Thane Industrial Complex Monitor",
      position: [19.2183, 72.9781],
      aqi: 168,
      pollutants: { pm25: 74, pm10: 95, no2: 52, o3: 82 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "industrial",
      city: "Thane",
    },
    // Delhi Region
    {
      id: "delhi-1",
      name: "Connaught Place Central Station",
      position: [28.6315, 77.2167],
      aqi: 287,
      pollutants: { pm25: 142, pm10: 198, no2: 78, o3: 45 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "government",
      city: "Delhi",
    },
    {
      id: "delhi-2",
      name: "Anand Vihar Traffic Junction Monitor",
      position: [28.6469, 77.3152],
      aqi: 312,
      pollutants: { pm25: 156, pm10: 215, no2: 85, o3: 38 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "traffic",
      city: "Delhi",
    },
    // Bangalore
    {
      id: "bangalore-1",
      name: "Silk Board Junction Traffic Monitor",
      position: [12.9173, 77.6221],
      aqi: 98,
      pollutants: { pm25: 42, pm10: 58, no2: 28, o3: 65 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "traffic",
      city: "Bangalore",
    },
    {
      id: "bangalore-2",
      name: "Whitefield Tech Park Area",
      position: [12.9698, 77.75],
      aqi: 76,
      pollutants: { pm25: 32, pm10: 45, no2: 22, o3: 58 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "residential",
      city: "Bangalore",
    },
    // Chennai
    {
      id: "chennai-1",
      name: "T. Nagar Commercial District",
      position: [13.0418, 80.2341],
      aqi: 124,
      pollutants: { pm25: 54, pm10: 72, no2: 35, o3: 62 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "government",
      city: "Chennai",
    },
    // Kolkata
    {
      id: "kolkata-1",
      name: "Park Street Cultural Hub",
      position: [22.5448, 88.3426],
      aqi: 178,
      pollutants: { pm25: 78, pm10: 102, no2: 48, o3: 55 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "government",
      city: "Kolkata",
    },
    // Pune
    {
      id: "pune-1",
      name: "Shivajinagar City Center",
      position: [18.5314, 73.8446],
      aqi: 112,
      pollutants: { pm25: 48, pm10: 65, no2: 32, o3: 68 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "government",
      city: "Pune",
    },
    // Hyderabad
    {
      id: "hyderabad-1",
      name: "HITEC City IT Hub",
      position: [17.4435, 78.3772],
      aqi: 89,
      pollutants: { pm25: 38, pm10: 52, no2: 25, o3: 72 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "industrial",
      city: "Hyderabad",
    },
  ]

  const generateHeatmapData = (): HeatmapPoint[] => {
    const points: HeatmapPoint[] = []
    const baseTime = timeHour

    // Generate points around major cities with realistic patterns
    const cityHotspots = [
      { center: [19.076, 72.8777], intensity: 0.8, name: "Mumbai" }, // Mumbai
      { center: [28.6315, 77.2167], intensity: 1.0, name: "Delhi" }, // Delhi
      { center: [12.9716, 77.5946], intensity: 0.6, name: "Bangalore" }, // Bangalore
      { center: [13.0827, 80.2707], intensity: 0.7, name: "Chennai" }, // Chennai
      { center: [22.5726, 88.3639], intensity: 0.9, name: "Kolkata" }, // Kolkata
    ]

    cityHotspots.forEach((hotspot) => {
      for (let i = 0; i < 15; i++) {
        const lat = hotspot.center[0] + (Math.random() - 0.5) * 0.3
        const lng = hotspot.center[1] + (Math.random() - 0.5) * 0.3

        // Simulate realistic pollution patterns
        const rushHourMultiplier = (baseTime >= 7 && baseTime <= 10) || (baseTime >= 17 && baseTime <= 20) ? 1.4 : 1.0
        const nightReduction = baseTime >= 22 || baseTime <= 5 ? 0.7 : 1.0
        const baseAQI = (Math.random() * 100 + 50) * hotspot.intensity
        const aqi = Math.max(0, Math.min(500, baseAQI * rushHourMultiplier * nightReduction))

        points.push({
          position: [lat, lng],
          aqi,
          intensity: aqi / 500,
        })
      }
    })

    return points
  }

  const heatmapData = generateHeatmapData()

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return "#10b981" // Green - Good
    if (aqi <= 100) return "#f59e0b" // Yellow - Moderate
    if (aqi <= 150) return "#f97316" // Orange - Unhealthy for Sensitive
    if (aqi <= 200) return "#ef4444" // Red - Unhealthy
    if (aqi <= 300) return "#8b5cf6" // Purple - Very Unhealthy
    return "#7c2d12" // Maroon - Hazardous
  }

  const getAQILabel = (aqi: number): string => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    if (aqi <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  const getStationIcon = (type: string) => {
    switch (type) {
      case "government":
        return "🏛️" // Government monitoring station
      case "industrial":
        return "🏭" // Industrial area monitor
      case "residential":
        return "🏠" // Residential area monitor
      case "traffic":
        return "🚗" // Traffic junction monitor
      default:
        return "📍" // Default location marker
    }
  }

  const getStationTypeDescription = (type: string) => {
    switch (type) {
      case "government":
        return "Official government monitoring station providing regulatory compliance data"
      case "industrial":
        return "Industrial area monitor tracking emissions from manufacturing and commercial activities"
      case "residential":
        return "Residential area monitor measuring air quality in populated neighborhoods"
      case "traffic":
        return "Traffic junction monitor focusing on vehicle emission impacts"
      default:
        return "Air quality monitoring station"
    }
  }

  const getHealthImpact = (aqi: number) => {
    if (aqi <= 50) return "Air quality is satisfactory. Air pollution poses little or no risk."
    if (aqi <= 100) return "Air quality is acceptable. Unusually sensitive people may experience minor symptoms."
    if (aqi <= 150)
      return "Members of sensitive groups may experience health effects. General public not likely affected."
    if (aqi <= 200)
      return "Some members of general public may experience health effects; sensitive groups more seriously affected."
    if (aqi <= 300) return "Health alert: The risk of health effects is increased for everyone."
    return "Health warning of emergency conditions: everyone is more likely to be affected."
  }

  if (!leafletLoaded || !mapReady) {
    return (
      <div className="w-full h-full bg-slate-800 animate-pulse rounded-lg flex items-center justify-center text-slate-400">
        <div className="text-center">
          <Satellite className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
          <div className="text-sm">Loading satellite imagery...</div>
          <div className="text-xs text-slate-500 mt-1">Connecting to monitoring stations</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", minHeight: "500px" }}
        className="leaflet-container-dark z-0"
        key={`map-${center[0]}-${center[1]}-${zoom}`}
      >
        {mapLayer === "satellite" ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='© <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics'
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}

        {/* Enhanced Heatmap Circles with better visibility */}
        {heatmapData.map((point, index) => (
          <Circle
            key={`heatmap-${index}-${timeHour}`}
            center={point.position}
            radius={Math.max(1000, point.intensity * 3000)}
            fillColor={getAQIColor(point.aqi)}
            fillOpacity={0.3}
            stroke={true}
            color={getAQIColor(point.aqi)}
            weight={1}
            opacity={0.6}
          />
        ))}

        {monitoringStations.map((station) => (
          <Marker
            key={station.id}
            position={station.position}
            eventHandlers={{
              click: () => onStationSelect(station),
            }}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div className="text-slate-900 min-w-[280px]">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{getStationIcon(station.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-base text-slate-800 leading-tight">{station.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {station.city} • {station.type.charAt(0).toUpperCase() + station.type.slice(1)} Station
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {getStationTypeDescription(station.type)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Current AQI</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: getAQIColor(station.aqi) }}
                      />
                      <span className="font-bold text-slate-800 text-xl">{station.aqi}</span>
                    </div>
                  </div>

                  <div className="text-center p-2 rounded" style={{ backgroundColor: getAQIColor(station.aqi) + "20" }}>
                    <span className="text-sm font-semibold" style={{ color: getAQIColor(station.aqi) }}>
                      {getAQILabel(station.aqi)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-50 p-2 rounded border">
                      <div className="text-slate-500 text-xs font-medium">PM2.5</div>
                      <div className="text-slate-800 font-semibold">{station.pollutants.pm25} μg/m³</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border">
                      <div className="text-slate-500 text-xs font-medium">PM10</div>
                      <div className="text-slate-800 font-semibold">{station.pollutants.pm10} μg/m³</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border">
                      <div className="text-slate-500 text-xs font-medium">NO₂</div>
                      <div className="text-slate-800 font-semibold">{station.pollutants.no2} ppb</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border">
                      <div className="text-slate-500 text-xs font-medium">O₃</div>
                      <div className="text-slate-800 font-semibold">{station.pollutants.o3} ppb</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                    <div className="text-xs font-medium text-blue-800 mb-1">Health Impact</div>
                    <div className="text-xs text-blue-700 leading-relaxed">{getHealthImpact(station.aqi)}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Live Data</span>
                    </div>
                    <span>Updated: {new Date(station.lastUpdated).toLocaleTimeString()}</span>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      Click marker for detailed analysis dashboard
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export function LeafletAirQualityMap({
  center = [20.5937, 78.9629], // India center for better overview
  zoom = 6,
  className = "",
}: LeafletAirQualityMapProps) {
  const [selectedPollutant, setSelectedPollutant] = useState<string>("pm25")
  const [mapLayer, setMapLayer] = useState<string>("satellite")
  const [timeHour, setTimeHour] = useState<number>(12)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null)
  const intervalRef = useRef<NodeJS.Timeout>()
  const [currentCity, setCurrentCity] = useState({
    name: "India Overview",
    center: [20.5937, 78.9629],
    zoom: 6,
  })

  const majorCities = [
    { name: "India Overview", center: [20.5937, 78.9629], zoom: 6 },
    { name: "Mumbai", center: [19.076, 72.8777], zoom: 11 },
    { name: "Delhi", center: [28.6315, 77.2167], zoom: 11 },
    { name: "Bangalore", center: [12.9716, 77.5946], zoom: 11 },
    { name: "Chennai", center: [13.0827, 80.2707], zoom: 11 },
    { name: "Kolkata", center: [22.5726, 88.3639], zoom: 11 },
    { name: "Pune", center: [18.5204, 73.8567], zoom: 11 },
    { name: "Hyderabad", center: [17.385, 78.4867], zoom: 11 },
  ]

  // Time-lapse animation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTimeHour((prev) => (prev + 1) % 24)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying])

  const exportScreenshot = () => {
    console.log("[v0] Exporting map screenshot...")
    alert("Screenshot export functionality would be implemented here")
  }

  const shareLocation = () => {
    console.log("[v0] Sharing location...")
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/dashboard?lat=${center[0]}&lng=${center[1]}`
      navigator.clipboard.writeText(url)
      alert("Location link copied to clipboard!")
    }
  }

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return "#10b981" // Green - Good
    if (aqi <= 100) return "#f59e0b" // Yellow - Moderate
    if (aqi <= 150) return "#f97316" // Orange - Unhealthy for Sensitive
    if (aqi <= 200) return "#ef4444" // Red - Unhealthy
    if (aqi <= 300) return "#8b5cf6" // Purple - Very Unhealthy
    return "#7c2d12" // Maroon - Hazardous
  }

  const getAQILabel = (aqi: number): string => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    if (aqi <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  const getStationIcon = (type: string) => {
    switch (type) {
      case "government":
        return "🏛️" // Government monitoring station
      case "industrial":
        return "🏭" // Industrial area monitor
      case "residential":
        return "🏠" // Residential area monitor
      case "traffic":
        return "🚗" // Traffic junction monitor
      default:
        return "📍" // Default location marker
    }
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Enhanced Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <Card className="p-3 bg-slate-900/95 border-slate-700 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <Select
                value={currentCity.name}
                onValueChange={(value) => {
                  const city = majorCities.find((c) => c.name === value)
                  if (city) setCurrentCity(city)
                }}
              >
                <SelectTrigger className="w-36 h-8 bg-slate-800 border-slate-600 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {majorCities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Layer Switcher */}
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <Select value={mapLayer} onValueChange={setMapLayer}>
                <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="street">Street Map</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pollutant Selector */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded-full" />
              <Select value={selectedPollutant} onValueChange={setSelectedPollutant}>
                <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pm25">PM2.5</SelectItem>
                  <SelectItem value="pm10">PM10</SelectItem>
                  <SelectItem value="no2">NO₂</SelectItem>
                  <SelectItem value="o3">O₃</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{timeHour}:00</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-6 w-6 p-0 bg-slate-800 border-slate-600"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
              </div>
              <Slider
                value={[timeHour]}
                onValueChange={(value) => setTimeHour(value[0])}
                max={23}
                min={0}
                step={1}
                className="w-40"
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={exportScreenshot}
            className="bg-slate-900/90 border-slate-700 hover:bg-slate-800"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={shareLocation}
            className="bg-slate-900/90 border-slate-700 hover:bg-slate-800"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Station Details Panel */}
      {selectedStation && (
        <div className="absolute top-4 right-4 z-[1000] w-80">
          <Card className="p-4 bg-slate-900/95 border-slate-700 backdrop-blur-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getStationIcon(selectedStation.type)}</span>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{selectedStation.name}</h3>
                    <p className="text-xs text-slate-400">
                      {selectedStation.city} • {selectedStation.type} station
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSelectedStation(null)} className="h-6 w-6 p-0">
                  ×
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                  <span className="text-sm text-slate-400">Current AQI</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getAQIColor(selectedStation.aqi) }}
                    />
                    <span className="font-bold text-white text-lg">{selectedStation.aqi}</span>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-sm font-medium" style={{ color: getAQIColor(selectedStation.aqi) }}>
                    {getAQILabel(selectedStation.aqi)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-800/30 p-2 rounded">
                    <div className="text-slate-400 text-xs">PM2.5</div>
                    <div className="text-white font-medium">{selectedStation.pollutants.pm25} μg/m³</div>
                  </div>
                  <div className="bg-slate-800/30 p-2 rounded">
                    <div className="text-slate-400 text-xs">PM10</div>
                    <div className="text-white font-medium">{selectedStation.pollutants.pm10} μg/m³</div>
                  </div>
                  <div className="bg-slate-800/30 p-2 rounded">
                    <div className="text-slate-400 text-xs">NO₂</div>
                    <div className="text-white font-medium">{selectedStation.pollutants.no2} ppb</div>
                  </div>
                  <div className="bg-slate-800/30 p-2 rounded">
                    <div className="text-slate-400 text-xs">O₃</div>
                    <div className="text-white font-medium">{selectedStation.pollutants.o3} ppb</div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 pt-2 border-t border-slate-700 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Last updated: {new Date(selectedStation.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Map Container */}
      <div className="w-full h-full min-h-[500px] bg-slate-800 rounded-lg overflow-hidden">
        <MapComponent
          center={currentCity.center}
          zoom={currentCity.zoom}
          selectedPollutant={selectedPollutant}
          mapLayer={mapLayer}
          timeHour={timeHour}
          onStationSelect={setSelectedStation}
        />
      </div>

      {/* Enhanced Legend */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <Card className="p-3 bg-slate-900/95 border-slate-700 backdrop-blur-sm">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Air Quality Index
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-slate-300">0-50 Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-slate-300">51-100 Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-slate-300">101-150 Unhealthy for Sensitive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-slate-300">151-200 Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-slate-300">201-300 Very Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-900" />
              <span className="text-slate-300">300+ Hazardous</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-700">
            <div className="text-xs text-slate-400 mb-1">Station Types:</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center gap-1">
                <span>🏛️</span>
                <span className="text-slate-300">Government</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🏭</span>
                <span className="text-slate-300">Industrial</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🏠</span>
                <span className="text-slate-300">Residential</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🚗</span>
                <span className="text-slate-300">Traffic</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
