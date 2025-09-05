"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, Share2, Play, Pause, Layers, MapPin, Satellite, Building2, Search, X } from "lucide-react"

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

interface CityData {
  name: string
  center: [number, number]
  zoom: number
  state?: string
}

interface LeafletAirQualityMapProps {
  center?: [number, number]
  zoom?: number
  className?: string
}

export function LeafletAirQualityMap({
  center = [20.5937, 78.9629],
  zoom = 6,
  className = "",
}: LeafletAirQualityMapProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [selectedPollutant, setSelectedPollutant] = useState<string>("pm25")
  const [mapLayer, setMapLayer] = useState<string>("satellite")
  const [timeHour, setTimeHour] = useState<number>(12)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<CityData[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentCity, setCurrentCity] = useState<CityData>({
    name: "India Overview",
    center: [20.5937, 78.9629],
    zoom: 6,
  })
  const intervalRef = useRef<NodeJS.Timeout>()

  const majorCities: CityData[] = [
    { name: "India Overview", center: [20.5937, 78.9629], zoom: 6, state: "National" },
    { name: "Mumbai", center: [19.076, 72.8777], zoom: 12, state: "Maharashtra" },
    { name: "Delhi", center: [28.6315, 77.2167], zoom: 12, state: "Delhi" },
    { name: "Bangalore", center: [12.9716, 77.5946], zoom: 12, state: "Karnataka" },
    { name: "Chennai", center: [13.0827, 80.2707], zoom: 12, state: "Tamil Nadu" },
    { name: "Kolkata", center: [22.5726, 88.3639], zoom: 12, state: "West Bengal" },
    { name: "Pune", center: [18.5204, 73.8567], zoom: 12, state: "Maharashtra" },
    { name: "Hyderabad", center: [17.385, 78.4867], zoom: 12, state: "Telangana" },
    { name: "Ahmedabad", center: [23.0225, 72.5714], zoom: 12, state: "Gujarat" },
    { name: "Jaipur", center: [26.9124, 75.7873], zoom: 12, state: "Rajasthan" },
    { name: "Surat", center: [21.1702, 72.8311], zoom: 12, state: "Gujarat" },
    { name: "Lucknow", center: [26.8467, 80.9462], zoom: 12, state: "Uttar Pradesh" },
    { name: "Kanpur", center: [26.4499, 80.3319], zoom: 12, state: "Uttar Pradesh" },
    { name: "Nagpur", center: [21.1458, 79.0882], zoom: 12, state: "Maharashtra" },
    { name: "Indore", center: [22.7196, 75.8577], zoom: 12, state: "Madhya Pradesh" },
    { name: "Patna", center: [25.5941, 85.1376], zoom: 12, state: "Bihar" },
    { name: "Bhopal", center: [23.2599, 77.4126], zoom: 12, state: "Madhya Pradesh" },
    { name: "Visakhapatnam", center: [17.6868, 83.2185], zoom: 12, state: "Andhra Pradesh" },
    { name: "Coimbatore", center: [11.0168, 76.9558], zoom: 12, state: "Tamil Nadu" },
    { name: "Kochi", center: [9.9312, 76.2673], zoom: 12, state: "Kerala" },
    { name: "Thiruvananthapuram", center: [8.5241, 76.9366], zoom: 12, state: "Kerala" },
    { name: "Kozhikode", center: [11.2588, 75.7804], zoom: 12, state: "Kerala" },
    { name: "Thrissur", center: [10.5276, 76.2144], zoom: 12, state: "Kerala" },
    { name: "Madurai", center: [9.9252, 78.1198], zoom: 12, state: "Tamil Nadu" },
    { name: "Tiruchirappalli", center: [10.7905, 78.7047], zoom: 12, state: "Tamil Nadu" },
    { name: "Mysore", center: [12.2958, 76.6394], zoom: 12, state: "Karnataka" },
    { name: "Hubli", center: [15.3647, 75.124], zoom: 12, state: "Karnataka" },
    { name: "Mangalore", center: [12.9141, 74.856], zoom: 12, state: "Karnataka" },
    { name: "Vadodara", center: [22.3072, 73.1812], zoom: 12, state: "Gujarat" },
    { name: "Rajkot", center: [22.3039, 70.8022], zoom: 12, state: "Gujarat" },
    { name: "Jodhpur", center: [26.2389, 73.0243], zoom: 12, state: "Rajasthan" },
    { name: "Kota", center: [25.2138, 75.8648], zoom: 12, state: "Rajasthan" },
    { name: "Udaipur", center: [24.5854, 73.7125], zoom: 12, state: "Rajasthan" },
    { name: "Agra", center: [27.1767, 78.0081], zoom: 12, state: "Uttar Pradesh" },
    { name: "Varanasi", center: [25.3176, 82.9739], zoom: 12, state: "Uttar Pradesh" },
    { name: "Meerut", center: [28.9845, 77.7064], zoom: 12, state: "Uttar Pradesh" },
    { name: "Allahabad", center: [25.4358, 81.8463], zoom: 12, state: "Uttar Pradesh" },
    { name: "Gwalior", center: [26.2183, 78.1828], zoom: 12, state: "Madhya Pradesh" },
    { name: "Jabalpur", center: [23.1815, 79.9864], zoom: 12, state: "Madhya Pradesh" },
    { name: "Ujjain", center: [23.1765, 75.7885], zoom: 12, state: "Madhya Pradesh" },
    { name: "Nashik", center: [19.9975, 73.7898], zoom: 12, state: "Maharashtra" },
    { name: "Aurangabad", center: [19.8762, 75.3433], zoom: 12, state: "Maharashtra" },
    { name: "Solapur", center: [17.6599, 75.9064], zoom: 12, state: "Maharashtra" },
    { name: "Guwahati", center: [26.1445, 91.7362], zoom: 12, state: "Assam" },
    { name: "Ludhiana", center: [30.901, 75.8573], zoom: 12, state: "Punjab" },
    { name: "Amritsar", center: [31.634, 74.8723], zoom: 12, state: "Punjab" },
    { name: "Jalandhar", center: [31.326, 75.5762], zoom: 12, state: "Punjab" },
    { name: "Faridabad", center: [28.4089, 77.3178], zoom: 12, state: "Haryana" },
    { name: "Gurgaon", center: [28.4595, 77.0266], zoom: 12, state: "Haryana" },
    { name: "Ranchi", center: [23.3441, 85.3096], zoom: 12, state: "Jharkhand" },
    { name: "Jamshedpur", center: [22.8046, 86.2029], zoom: 12, state: "Jharkhand" },
    { name: "Dhanbad", center: [23.7957, 86.4304], zoom: 12, state: "Jharkhand" },
    { name: "Raipur", center: [21.2514, 81.6296], zoom: 12, state: "Chhattisgarh" },
    { name: "Bhilai", center: [21.1938, 81.3509], zoom: 12, state: "Chhattisgarh" },
    { name: "Bhubaneswar", center: [20.2961, 85.8245], zoom: 12, state: "Odisha" },
    { name: "Cuttack", center: [20.4625, 85.8828], zoom: 12, state: "Odisha" },
    { name: "Chandigarh", center: [30.7333, 76.7794], zoom: 12, state: "Chandigarh" },
    { name: "Dehradun", center: [30.3165, 78.0322], zoom: 12, state: "Uttarakhand" },
    { name: "Shimla", center: [31.1048, 77.1734], zoom: 12, state: "Himachal Pradesh" },
    { name: "Srinagar", center: [34.0837, 74.7973], zoom: 12, state: "Jammu & Kashmir" },
    { name: "Jammu", center: [32.7266, 74.857], zoom: 12, state: "Jammu & Kashmir" },
    { name: "Panaji", center: [15.4909, 73.8278], zoom: 12, state: "Goa" },
    { name: "Imphal", center: [24.817, 93.9368], zoom: 12, state: "Manipur" },
    { name: "Aizawl", center: [23.7271, 92.7176], zoom: 12, state: "Mizoram" },
    { name: "Shillong", center: [25.5788, 91.8933], zoom: 12, state: "Meghalaya" },
    { name: "Agartala", center: [23.8315, 91.2868], zoom: 12, state: "Tripura" },
    { name: "Kohima", center: [25.6751, 94.1086], zoom: 12, state: "Nagaland" },
    { name: "Itanagar", center: [27.0844, 93.6053], zoom: 12, state: "Arunachal Pradesh" },
    { name: "Gangtok", center: [27.3389, 88.6065], zoom: 12, state: "Sikkim" },
  ]

  const monitoringStations: MonitoringStation[] = [
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
      id: "chennai-1",
      name: "T. Nagar Commercial District",
      position: [13.0418, 80.2341],
      aqi: 124,
      pollutants: { pm25: 54, pm10: 72, no2: 35, o3: 62 },
      lastUpdated: "2024-01-15T12:00:00Z",
      type: "government",
      city: "Chennai",
    },
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
  ]

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      try {
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          link.crossOrigin = ""
          document.head.appendChild(link)
        }

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
        console.error("Failed to load Leaflet:", error)
      }
    }
    loadLeaflet()
  }, [])

  const searchCities = (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const filtered = majorCities
      .filter(
        (city) =>
          city.name.toLowerCase().includes(term.toLowerCase()) ||
          (city.state && city.state.toLowerCase().includes(term.toLowerCase())),
      )
      .slice(0, 10)

    setSearchResults(filtered)
    setShowSearchResults(true)
  }

  const handleSearchSelect = (city: CityData) => {
    console.log("Selected city from search:", city)
    setCurrentCity(city)
    setSearchTerm(city.name)
    setShowSearchResults(false)
  }

  const handleCityChange = (value: string) => {
    console.log("Selected city from dropdown:", value)
    const city = majorCities.find((c) => c.name === value)
    if (city) {
      setCurrentCity(city)
      setSearchTerm(city.name)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTimeHour((prev) => (prev + 1) % 24)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying])

  const generateHeatmapData = (): HeatmapPoint[] => {
    const points: HeatmapPoint[] = []
    const baseTime = timeHour

    const cityHotspots = [
      { center: [19.076, 72.8777] as [number, number], intensity: 0.8, name: "Mumbai" },
      { center: [28.6315, 77.2167] as [number, number], intensity: 1.0, name: "Delhi" },
      { center: [12.9716, 77.5946] as [number, number], intensity: 0.6, name: "Bangalore" },
      { center: [13.0827, 80.2707] as [number, number], intensity: 0.7, name: "Chennai" },
      { center: [22.5726, 88.3639] as [number, number], intensity: 0.9, name: "Kolkata" },
    ]

    cityHotspots.forEach((hotspot) => {
      for (let i = 0; i < 15; i++) {
        const lat = hotspot.center[0] + (Math.random() - 0.5) * 0.3
        const lng = hotspot.center[1] + (Math.random() - 0.5) * 0.3

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
    if (aqi <= 50) return "#10b981"
    if (aqi <= 100) return "#f59e0b"
    if (aqi <= 150) return "#f97316"
    if (aqi <= 200) return "#ef4444"
    if (aqi <= 300) return "#8b5cf6"
    return "#7c2d12"
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
        return "🏛️"
      case "industrial":
        return "🏭"
      case "residential":
        return "🏠"
      case "traffic":
        return "🚗"
      default:
        return "📍"
    }
  }

  const getCityIcon = () => {
    return "🏙️"
  }

  const generateRandomAQI = (cityName: string): number => {
    // Generate consistent but random AQI for cities
    const cityHash = cityName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return Math.floor((cityHash % 200) + 50) // AQI between 50-250
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

  const exportScreenshot = () => {
    console.log("Exporting map screenshot...")
    alert("Screenshot export functionality would be implemented here")
  }

  const shareLocation = () => {
    console.log("Sharing location...")
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/dashboard?lat=${currentCity.center[0]}&lng=${currentCity.center[1]}`
      navigator.clipboard.writeText(url)
      alert("Location link copied to clipboard!")
    }
  }

  if (!leafletLoaded || !mapReady) {
    return (
      <div className={`relative w-full h-full min-h-[500px] bg-slate-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Satellite className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
          <div className="text-sm text-white">Loading satellite imagery...</div>
          <div className="text-xs text-slate-500 mt-1">Connecting to monitoring stations</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Search Interface */}
      <div className="absolute top-4 left-4 z-[1000] w-80">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cities (e.g., Mumbai, Delhi, Bangalore...)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                searchCities(e.target.value)
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setShowSearchResults(false)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-[1001]">
              {searchResults.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchSelect(city)}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center justify-between border-b border-gray-700 last:border-b-0"
                >
                  <div>
                    <div className="font-medium">{city.name}</div>
                    {city.state && <div className="text-sm text-gray-400">{city.state}</div>}
                  </div>
                  <MapPin className="h-4 w-4 text-blue-400" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2 max-w-xs">
        <Card className="p-3 bg-slate-900/95 border-slate-700 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <Select value={currentCity.name} onValueChange={handleCityChange}>
                <SelectTrigger className="w-48 h-8 bg-slate-800 border-slate-600 text-xs text-white">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 max-h-60 overflow-y-auto z-[1002]">
                  {majorCities.map((city) => (
                    <SelectItem
                      key={city.name}
                      value={city.name}
                      className="text-white hover:bg-slate-700 focus:bg-slate-700"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{city.name}</span>
                        {city.state && <span className="text-xs text-slate-400">{city.state}</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

      {/* Station Details Panel */}
      {selectedStation && (
        <div className="absolute top-20 left-4 z-[999] w-80 max-h-[calc(100vh-8rem)] overflow-y-auto">
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
                <Button size="sm" variant="ghost" onClick={() => setSelectedStation(null)} className="h-6 w-6 p-0 text-white">
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

                <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                  <div className="text-xs font-medium text-blue-800 mb-1">Health Impact</div>
                  <div className="text-xs text-blue-700 leading-relaxed">{getHealthImpact(selectedStation.aqi)}</div>
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
        {leafletLoaded && mapReady && (
          <MapContainer
            center={currentCity.center}
            zoom={currentCity.zoom}
            style={{ height: "100%", width: "100%" }}
            className="leaflet-container-dark z-0"
            key={`${currentCity.name}-${currentCity.center[0]}-${currentCity.center[1]}-${currentCity.zoom}`}
          >
            <TileLayer
              url={
                mapLayer === "satellite"
                  ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
              attribution={
                mapLayer === "satellite"
                  ? '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics'
                  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            />

            {/* Heatmap Circles */}
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
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">AQI: {Math.round(point.aqi)}</div>
                    <div className="text-xs text-gray-600">{getAQILabel(point.aqi)}</div>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* City Markers for all cities in the list */}
            {majorCities
              .filter((city) => city.name !== "India Overview")
              .map((city) => {
                const cityAQI = generateRandomAQI(city.name)
                return (
                  <Marker key={`city-${city.name}`} position={city.center}>
                    <Popup>
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getCityIcon()}</span>
                          <div>
                            <div className="font-semibold">{city.name}</div>
                            <div className="text-xs text-gray-600">{city.state}</div>
                          </div>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Estimated AQI: </span>
                          <span className="font-bold" style={{ color: getAQIColor(cityAQI) }}>
                            {cityAQI}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">{getAQILabel(cityAQI)}</div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}

            {/* Monitoring Stations */}
            {monitoringStations.map((station) => (
              <Marker
                key={station.id}
                position={station.position}
                eventHandlers={{
                  click: () => setSelectedStation(station),
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
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] max-w-xs">
        <Card className="p-3 bg-slate-900/95 border-slate-700 backdrop-blur-sm">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            AQI Legend
          </h4>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-slate-300 truncate">0-50 Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
              <span className="text-slate-300 truncate">51-100 Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
              <span className="text-slate-300 truncate">101-150 Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-slate-300 truncate">151-200 Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0" />
              <span className="text-slate-300 truncate">201-300 Very Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-900 flex-shrink-0" />
              <span className="text-slate-300 truncate">300+ Hazardous</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
