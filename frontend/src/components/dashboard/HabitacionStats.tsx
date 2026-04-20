"use client"

import { useMemo } from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HabitacionDTO, EstadoHabitacion } from "@/types/api"

// Colores corporativos según el estado
const ESTADO_COLORS: Record<string, string> = {
  [EstadoHabitacion.Disponible]: "#22c55e", // Green-500
  [EstadoHabitacion.Ocupada]: "#ef4444",    // Red-500
  [EstadoHabitacion.Reservada]: "#3b82f6",  // Blue-500
  [EstadoHabitacion.Limpieza]: "#eab308",   // Yellow-500
  [EstadoHabitacion.Mantenimiento]: "#64748b" // Slate-500
}

export function HabitacionStats({ habitaciones }: { habitaciones: HabitacionDTO[] }) {
  const data = useMemo(() => {
    const counts = habitaciones.reduce((acc, h) => {
      acc[h.estado] = (acc[h.estado] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [habitaciones])

  return (
    <Card className="border shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-black text-slate-800">Estado del Inventario</CardTitle>
        <CardDescription>Ocupación real de unidades físicas</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={ESTADO_COLORS[entry.name] || "#cbd5e1"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}