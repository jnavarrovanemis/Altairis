"use client"

import { useState, useMemo } from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HotelDTO } from "@/types/api"

interface HotelStatsProps {
  hoteles: HotelDTO[]
}

type ViewMode = "ciudad" | "estrellas" | "estado"

export function HotelStats({ hoteles }: HotelStatsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("ciudad")

  // Procesamiento de datos memorizado para optimizar rendimiento
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {}

    hoteles.forEach((hotel) => {
      let key = ""
      if (viewMode === "ciudad") key = hotel.ciudad
      if (viewMode === "estrellas") key = `${hotel.estrellas} Estrellas`
      if (viewMode === "estado") key = hotel.activo ? "Activo" : "Inactivo"

      counts[key] = (counts[key] || 0) + 1
    })

    return Object.entries(counts).map(([name, cantidad]) => ({
      name,
      cantidad,
    }))
  }, [hoteles, viewMode])

  // Configuración dinámica del gráfico
  const chartConfig = {
    cantidad: {
      label: "Cantidad",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  // Textos dinámicos según el modo
  const labels = {
    ciudad: { title: "Distribución Geográfica", desc: "Hoteles por ciudad" },
    estrellas: { title: "Segmentación por Categoría", desc: "Clasificación por estrellas" },
    estado: { title: "Estado Operativo", desc: "Disponibilidad actual en red" },
  }

  return (
    <Card className="col-span-4 border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">{labels[viewMode].title}</CardTitle>
          <CardDescription>{labels[viewMode].desc}</CardDescription>
        </div>
        
        {/* Selector de modo - Estilo Enterprise */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-fit">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100/50">
            <TabsTrigger value="ciudad" className="text-xs">Ciudad</TabsTrigger>
            <TabsTrigger value="estrellas" className="text-xs">Estrellas</TabsTrigger>
            <TabsTrigger value="estado" className="text-xs">Estado</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="px-2">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip 
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              content={<ChartTooltipContent hideLabel />} 
            />
            <Bar
              dataKey="cantidad"
              fill="var(--color-cantidad)"
              radius={[6, 6, 0, 0]}
              barSize={viewMode === "estado" ? 80 : 40} // Barras más anchas si hay pocos datos
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}