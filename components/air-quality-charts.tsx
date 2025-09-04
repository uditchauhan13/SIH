"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"

interface AirQualityChartsProps {
  city: string
}

export function AirQualityCharts({ city }: AirQualityChartsProps) {
  // Generate sample data for the last 24 hours
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    pm25: Math.floor(Math.random() * 50 + 30),
    pm10: Math.floor(Math.random() * 80 + 40),
    no2: Math.floor(Math.random() * 40 + 20),
    aqi: Math.floor(Math.random() * 60 + 40),
  }))

  // Generate forecast data for next 48 hours
  const forecastData = Array.from({ length: 48 }, (_, i) => ({
    hour: `${i}h`,
    predicted: Math.floor(Math.random() * 40 + 50),
    confidence: Math.floor(Math.random() * 20 + 80),
  }))

  // Generate accuracy comparison data
  const accuracyData = [
    { method: "Satellite Only", accuracy: 72 },
    { method: "Ground Stations", accuracy: 85 },
    { method: "AI Enhanced", accuracy: 94 },
    { method: "Hybrid Model", accuracy: 96 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Real-time Trends */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">24-Hour Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              pm25: { label: "PM2.5", color: "#ef4444" },
              pm10: { label: "PM10", color: "#f97316" },
              no2: { label: "NO2", color: "#06b6d4" },
              aqi: { label: "AQI", color: "#8b5cf6" },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="pm25" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pm10" stroke="#f97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="no2" stroke="#06b6d4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 48-Hour Forecast */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">48-Hour AQI Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              predicted: { label: "Predicted AQI", color: "#10b981" },
              confidence: { label: "Confidence %", color: "#06b6d4" },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="predicted" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Model Accuracy Comparison */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">Model Accuracy Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              accuracy: { label: "Accuracy %", color: "#8b5cf6" },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData} layout="horizontal">
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis type="category" dataKey="method" stroke="#64748b" fontSize={12} tickLine={false} width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="accuracy" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Confidence Zones */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">Prediction Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              confidence: { label: "Confidence %", color: "#06b6d4" },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData.slice(0, 24)}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[70, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="confidence" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
