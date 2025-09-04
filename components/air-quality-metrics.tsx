"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface AirQualityMetricsProps {
  city: string
  isProcessing: boolean
}

export function AirQualityMetrics({ city, isProcessing }: AirQualityMetricsProps) {
  const metrics = [
    {
      name: "PM2.5",
      value: 45,
      unit: "µg/m³",
      status: "moderate",
      trend: "down",
      change: -5,
    },
    {
      name: "PM10",
      value: 78,
      unit: "µg/m³",
      status: "moderate",
      trend: "up",
      change: 12,
    },
    {
      name: "NO2",
      value: 32,
      unit: "ppb",
      status: "good",
      trend: "stable",
      change: 0,
    },
    {
      name: "AQI",
      value: 89,
      unit: "",
      status: "moderate",
      trend: "down",
      change: -8,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "moderate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "poor":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-400" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-400" />
      default:
        return <Minus className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.name} className="bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300">{metric.name}</CardTitle>
              <Badge variant="secondary" className={getStatusColor(metric.status)}>
                {metric.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  {isProcessing ? (
                    <div className="w-12 h-6 bg-slate-700 animate-pulse rounded"></div>
                  ) : (
                    `${metric.value}${metric.unit}`
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  {getTrendIcon(metric.trend)}
                  <span>
                    {metric.change > 0 ? "+" : ""}
                    {metric.change} vs yesterday
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
