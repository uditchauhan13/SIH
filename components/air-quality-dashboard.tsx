"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AirQualityMap } from "./air-quality-map"
import { LeafletAirQualityMap } from "./leaflet-air-quality-map"
import { AirQualityCharts } from "./air-quality-charts"
import { AirQualityMetrics } from "./air-quality-metrics"
import { ArrowLeft, Zap, Satellite, MapPin, Clock, Wind, Thermometer, Droplets, CloudRain } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const cities = [
  { id: "mumbai", name: "Mumbai", coords: [19.076, 72.8777] as [number, number] },
  { id: "delhi", name: "Delhi", coords: [28.7041, 77.1025] as [number, number] },
  { id: "bangalore", name: "Bangalore", coords: [12.9716, 77.5946] as [number, number] },
  { id: "chennai", name: "Chennai", coords: [13.0827, 80.2707] as [number, number] },
  { id: "kolkata", name: "Kolkata", coords: [22.5726, 88.3639] as [number, number] },
]

export function AirQualityDashboard() {
  const [selectedCity, setSelectedCity] = useState("mumbai")
  const [zoomLevel, setZoomLevel] = useState([10])
  const [timeHour, setTimeHour] = useState([12])
  const [splitPosition, setSplitPosition] = useState([50])
  const [isProcessing, setIsProcessing] = useState(false)
  const [mapView, setMapView] = useState<"split" | "leaflet">("split")
  const [weatherParams, setWeatherParams] = useState({
    windSpeed: true,
    temperature: true,
    humidity: false,
    rainfall: false,
  })

  const currentCity = cities.find((city) => city.id === selectedCity)

  const handleCityChange = (cityId: string) => {
    setIsProcessing(true)
    setSelectedCity(cityId)
    setTimeout(() => setIsProcessing(false), 2000)
  }

  const handleEnhancement = () => {
    setIsProcessing(true)
    setTimeout(() => setIsProcessing(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <motion.div
        className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </motion.div>
              </Link>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Satellite className="h-6 w-6 text-cyan-400" />
                </motion.div>
                <h1 className="text-xl font-bold">AirSight AI Dashboard</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
              Live Data
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  Location & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">City</label>
                  <Select value={selectedCity} onValueChange={handleCityChange}>
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Zoom Level: {zoomLevel[0]}km</label>
                  <Slider value={zoomLevel} onValueChange={setZoomLevel} max={50} min={1} step={1} className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time: {timeHour[0]}:00
                  </label>
                  <Slider value={timeHour} onValueChange={setTimeHour} max={47} min={0} step={1} className="w-full" />
                  <div className="text-xs text-slate-400 mt-1">
                    {timeHour[0] < 24 ? "Today" : "Tomorrow"} - {timeHour[0] % 24}:00
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Map View</label>
                  <Select value={mapView} onValueChange={(value: "split" | "leaflet") => setMapView(value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="split">Split Comparison</SelectItem>
                      <SelectItem value="leaflet">Interactive Map</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Weather Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: "windSpeed", label: "Wind Speed", icon: Wind },
                  { key: "temperature", label: "Temperature", icon: Thermometer },
                  { key: "humidity", label: "Humidity", icon: Droplets },
                  { key: "rainfall", label: "Rainfall", icon: CloudRain },
                ].map((param, index) => (
                  <motion.div
                    key={param.key}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <param.icon className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">{param.label}</span>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={weatherParams[param.key as keyof typeof weatherParams] ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setWeatherParams((prev) => ({
                            ...prev,
                            [param.key]: !prev[param.key as keyof typeof weatherParams],
                          }))
                        }
                        className="h-6 px-2"
                      >
                        {weatherParams[param.key as keyof typeof weatherParams] ? "ON" : "OFF"}
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">AI Enhancement</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleEnhancement}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <motion.div
                      animate={isProcessing ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: isProcessing ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                    </motion.div>
                    {isProcessing ? "Processing..." : "Enhance Resolution"}
                  </Button>
                </motion.div>
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      className="mt-3 text-xs text-cyan-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        AI enhancement in progress...
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Dashboard */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Metrics Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <AirQualityMetrics city={currentCity?.name || "Mumbai"} isProcessing={isProcessing} />
            </motion.div>

            <AnimatePresence mode="wait">
              {mapView === "split" ? (
                <motion.div
                  key="split-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Satellite vs AI-Enhanced Comparison</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Poor</span>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Moderate</span>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Good</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        className="relative h-96 bg-slate-800 rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <AirQualityMap
                          city={currentCity}
                          splitPosition={splitPosition[0]}
                          zoomLevel={zoomLevel[0]}
                          isProcessing={isProcessing}
                        />

                        <motion.div
                          className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center pointer-events-none"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div
                            className="absolute top-0 bottom-0 w-1 bg-white/50 pointer-events-auto cursor-col-resize"
                            style={{ left: `${splitPosition[0]}%` }}
                          >
                            <motion.div
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                            </motion.div>
                          </div>
                        </motion.div>

                        <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1 rounded text-sm">
                          Satellite Data (10km)
                        </div>
                        <div className="absolute top-4 right-4 bg-slate-900/80 px-3 py-1 rounded text-sm">
                          AI-Enhanced (Street Level)
                        </div>
                      </motion.div>

                      <div className="mt-4">
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          Comparison Split: {splitPosition[0]}%
                        </label>
                        <Slider
                          value={splitPosition}
                          onValueChange={setSplitPosition}
                          max={100}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="leaflet-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg">Interactive Air Quality Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        className="h-[600px] bg-slate-800 rounded-lg overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <LeafletAirQualityMap
                          center={currentCity?.coords || [19.076, 72.8777]}
                          zoom={Math.max(8, 18 - zoomLevel[0])}
                          className="w-full h-full"
                        />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Charts and Technical Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Tabs defaultValue="charts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                  <TabsTrigger value="charts">Data Visualization</TabsTrigger>
                  <TabsTrigger value="technical">Technical Details</TabsTrigger>
                </TabsList>

                <TabsContent value="charts" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AirQualityCharts city={currentCity?.name || "Mumbai"} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="technical" className="mt-6">
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-slate-900/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-lg">Data Sources</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { name: "Sentinel-5P Satellite", status: "Active", color: "green" },
                          { name: "OpenWeather API", status: "Active", color: "green" },
                          { name: "Ground Stations", status: "Limited", color: "yellow" },
                        ].map((source, index) => (
                          <motion.div
                            key={source.name}
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <span className="text-sm">{source.name}</span>
                            <Badge variant="secondary" className={`bg-${source.color}-500/20 text-${source.color}-400`}>
                              {source.status}
                            </Badge>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-lg">Model Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { label: "Accuracy", value: "94.2%" },
                          { label: "Processing Time", value: "2.3s" },
                          { label: "Confidence Zone", value: "±15%" },
                          { label: "Last Update", value: "2 min ago" },
                        ].map((metric, index) => (
                          <motion.div
                            key={metric.label}
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <span className="text-sm">{metric.label}</span>
                            <span className="text-sm font-mono text-cyan-400">{metric.value}</span>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
