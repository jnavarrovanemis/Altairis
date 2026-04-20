"use client"

import { useMemo } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ReservaDTO } from "@/types/api"

export function ReservaStats({ reservas }: { reservas: ReservaDTO[] }) {
  const data = useMemo(() => {
    // Agrupamos por Hotel para ver quién vende más
    const counts = reservas.reduce((acc, r) => {
      acc[r.hotelNombre] = (acc[r.hotelNombre] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
  }, [reservas])

  return (
    <Card className="border shadow-sm bg-white col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-black text-slate-800">Flujo de Reservas</CardTitle>
        <CardDescription>Volumen de actividad por sede</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#6366f1" }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}