"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Play, Pause, RotateCcw } from "lucide-react"

// Mock data for accuracy comparison
const accuracyData = [
  { method: "Satellite Only", accuracy: 72, color: "#ef4444" },
  { method: "AI-Enhanced", accuracy: 94, color: "#06b6d4" },
  { method: "Ground Truth", accuracy: 98, color: "#10b981" },
]

// Mock data for processing time
const processingTimeData = [
  { task: "Data Collection", traditional: 240, aiEnhanced: 15 },
  { task: "Image Processing", traditional: 180, aiEnhanced: 8 },
  { task: "Quality Analysis", traditional: 120, aiEnhanced: 3 },
  { task: "Report Generation", traditional: 60, aiEnhanced: 2 },
]

// Mock data for Indian cities air quality trends
const cityTrendsData = [
  { time: "00:00", Delhi: 156, Mumbai: 89, Bangalore: 67, Chennai: 78, Kolkata: 134 },
  { time: "04:00", Delhi: 142, Mumbai: 82, Bangalore: 71, Chennai: 74, Kolkata: 128 },
  { time: "08:00", Delhi: 178, Mumbai: 95, Bangalore: 89, Chennai: 86, Kolkata: 145 },
  { time: "12:00", Delhi: 165, Mumbai: 88, Bangalore: 76, Chennai: 81, Kolkata: 139 },
  { time: "16:00", Delhi: 189, Mumbai: 102, Bangalore: 94, Chennai: 92, Kolkata: 156 },
  { time: "20:00", Delhi: 201, Mumbai: 118, Bangalore: 108, Chennai: 105, Kolkata: 167 },
  { time: "24:00", Delhi: 172, Mumbai: 96, Bangalore: 82, Chennai: 88, Kolkata: 148 },
]

// Mock data for resolution comparison
const resolutionData = [
  { resolution: "10km Grid", coverage: 100, accuracy: 65, detail: 30 },
  { resolution: "5km Grid", coverage: 95, accuracy: 78, detail: 55 },
  { resolution: "1km Grid", coverage: 85, accuracy: 89, detail: 80 },
  { resolution: "100m Grid", coverage: 70, accuracy: 94, detail: 95 },
]

// Animated counter component
function AnimatedCounter({
  value,
  duration = 2000,
  suffix = "",
}: { value: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export function DataChartsSection() {
  const [timeControl, setTimeControl] = useState([0])
  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-play time control
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setTimeControl((prev) => {
        const newValue = prev[0] + 1
        return newValue > 23 ? [0] : [newValue]
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
            AI Model Performance
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-slate-300 max-w-3xl mx-auto text-pretty">
            See how our AI-enhanced satellite monitoring outperforms traditional methods
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid gap-8"
        >
          {/* Key Metrics Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  <AnimatedCounter value={94} suffix="%" />
                </div>
                <p className="text-slate-300">Accuracy Rate</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  <AnimatedCounter value={28} suffix="s" />
                </div>
                <p className="text-slate-300">Processing Time</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  <AnimatedCounter value={100} suffix="m" />
                </div>
                <p className="text-slate-300">Grid Resolution</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  <AnimatedCounter value={50} suffix="+" />
                </div>
                <p className="text-slate-300">Cities Monitored</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Interactive Charts */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="accuracy" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="resolution">Resolution</TabsTrigger>
                <TabsTrigger value="trends">Live Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="accuracy" className="mt-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Accuracy Comparison</CardTitle>
                    <CardDescription className="text-slate-300">
                      Satellite vs AI-Enhanced vs Ground Truth measurements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        accuracy: {
                          label: "Accuracy %",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={accuracyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="method" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                            {accuracyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="processing" className="mt-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Processing Time Metrics</CardTitle>
                    <CardDescription className="text-slate-300">
                      Traditional vs AI-Enhanced processing times (minutes)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        traditional: {
                          label: "Traditional",
                          color: "#ef4444",
                        },
                        aiEnhanced: {
                          label: "AI-Enhanced",
                          color: "#06b6d4",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={processingTimeData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="task" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="traditional" fill="#ef4444" name="Traditional" />
                          <Bar dataKey="aiEnhanced" fill="#06b6d4" name="AI-Enhanced" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resolution" className="mt-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Resolution Improvement</CardTitle>
                    <CardDescription className="text-slate-300">
                      10km → 100m grid comparison showing coverage vs accuracy trade-offs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        coverage: {
                          label: "Coverage %",
                          color: "#8b5cf6",
                        },
                        accuracy: {
                          label: "Accuracy %",
                          color: "#06b6d4",
                        },
                        detail: {
                          label: "Detail Level %",
                          color: "#10b981",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={resolutionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="resolution" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="coverage" stroke="#8b5cf6" strokeWidth={3} />
                          <Line type="monotone" dataKey="accuracy" stroke="#06b6d4" strokeWidth={3} />
                          <Line type="monotone" dataKey="detail" stroke="#10b981" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Real-time Air Quality Trends</CardTitle>
                    <CardDescription className="text-slate-300">
                      Live AQI data for major Indian cities with time controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTimeControl([0])}
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Slider
                          value={timeControl}
                          onValueChange={setTimeControl}
                          max={23}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <span className="text-white font-mono">{String(timeControl[0]).padStart(2, "0")}:00</span>
                    </div>
                    <ChartContainer
                      config={{
                        Delhi: { label: "Delhi", color: "#ef4444" },
                        Mumbai: { label: "Mumbai", color: "#f97316" },
                        Bangalore: { label: "Bangalore", color: "#eab308" },
                        Chennai: { label: "Chennai", color: "#22c55e" },
                        Kolkata: { label: "Kolkata", color: "#8b5cf6" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cityTrendsData.slice(0, timeControl[0] + 1)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="Delhi"
                            stackId="1"
                            stroke="#ef4444"
                            fill="#ef4444"
                            fillOpacity={0.6}
                          />
                          <Area
                            type="monotone"
                            dataKey="Mumbai"
                            stackId="2"
                            stroke="#f97316"
                            fill="#f97316"
                            fillOpacity={0.6}
                          />
                          <Area
                            type="monotone"
                            dataKey="Bangalore"
                            stackId="3"
                            stroke="#eab308"
                            fill="#eab308"
                            fillOpacity={0.6}
                          />
                          <Area
                            type="monotone"
                            dataKey="Chennai"
                            stackId="4"
                            stroke="#22c55e"
                            fill="#22c55e"
                            fillOpacity={0.6}
                          />
                          <Area
                            type="monotone"
                            dataKey="Kolkata"
                            stackId="5"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.6}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
