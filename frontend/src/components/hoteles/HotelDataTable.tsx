"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HotelDTO } from "@/types/api"
import { EditHotelModal } from "@/components/hoteles/EditHotelModal"
import { DeleteHotelButton } from "@/components/hoteles/DeleteHotelButton"
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  RotateCcw,
  ChevronLeft,
  ChevronRight 
} from "lucide-react"

interface HotelDataTableProps {
  data: HotelDTO[]
  paginaActual: number
  totalPaginas: number
  totalRegistros: number
}

export function HotelDataTable({ 
  data, 
  paginaActual, 
  totalPaginas, 
  totalRegistros 
}: HotelDataTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [ciudadFilter, setCiudadFilter] = useState(searchParams.get("ciudad") || "")

  const currentEstrellas = searchParams.get("estrellas") || ""
  const currentActivo = searchParams.get("activo") || ""
  const currentOrden = searchParams.get("orden") || "nombre"
  const currentDireccion = searchParams.get("direccion") || "asc"
  const currentCantidad = searchParams.get("cantidad") || "10"

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    if (!updates.pagina) {
      params.set("pagina", "1")
    }

    router.push(`?${params.toString()}`)
  }

  const toggleSort = (column: string) => {
    const nextDir = currentOrden === column && currentDireccion === "asc" ? "desc" : "asc"
    updateQueryParams({ orden: column, direccion: nextDir })
  }

  const resetFilters = () => {
    setCiudadFilter("")
    router.push("/hoteles") 
  }

  return (
    <div className="space-y-4">
      {/* SECCIÓN DE FILTROS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border bg-card shadow-sm">
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
          <div className="relative w-full sm:w-auto min-w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ciudad (Enter)..."
              className="pl-8"
              value={ciudadFilter}
              onChange={(e) => setCiudadFilter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateQueryParams({ ciudad: ciudadFilter })}
            />
          </div>

          <select 
            className="flex h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            value={currentEstrellas}
            onChange={(e) => updateQueryParams({ estrellas: e.target.value })}
          >
            <option value="">Todas las estrellas</option>
            {[5,4,3,2,1].map(n => <option key={n} value={n.toString()}>{n} Estrellas</option>)}
          </select>

          <select 
            className="flex h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            value={currentActivo}
            onChange={(e) => updateQueryParams({ activo: e.target.value })}
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground hover:text-primary">
          <RotateCcw className="h-4 w-4 mr-2" /> Limpiar
        </Button>
      </div>

      {/* CONTENEDOR DE TABLA */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead onClick={() => toggleSort("nombre")} className="cursor-pointer font-bold text-slate-700 select-none">
                <div className="flex items-center gap-2">
                  Nombre 
                  {currentOrden === "nombre" ? (currentDireccion === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                </div>
              </TableHead>
              <TableHead onClick={() => toggleSort("ciudad")} className="cursor-pointer font-bold text-slate-700 select-none">
                <div className="flex items-center gap-2">
                  Ciudad 
                  {currentOrden === "ciudad" ? (currentDireccion === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                </div>
              </TableHead>
              <TableHead className="font-bold text-slate-700">Categoría</TableHead>
              <TableHead className="font-bold text-slate-700">Estado</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((hotel) => (
                <TableRow key={hotel.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium">{hotel.nombre}</TableCell>
                  <TableCell>{hotel.ciudad}</TableCell>
                  <TableCell className="text-amber-500 font-serif">{"★".repeat(hotel.estrellas)}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${hotel.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {hotel.activo ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <EditHotelModal hotel={hotel} />
                      <DeleteHotelButton id={hotel.id} nombre={hotel.nombre} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-slate-400">
                  No se encontraron hoteles con los filtros seleccionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PIE DE PÁGINA (PAGINACIÓN) */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
        <div className="flex items-center gap-6">
          <p className="text-sm text-muted-foreground">
            Total: <span className="text-foreground font-bold">{totalRegistros}</span> hoteles
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filas:</span>
            <select
              value={currentCantidad}
              onChange={(e) => updateQueryParams({ cantidad: e.target.value })}
              className="h-8 w-16 rounded-md border border-input bg-background text-xs font-bold outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {["5", "10", "20", "50"].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            Página <span className="text-foreground font-bold">{paginaActual}</span> de {totalPaginas}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQueryParams({ pagina: (paginaActual - 1).toString() })}
              disabled={paginaActual <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQueryParams({ pagina: (paginaActual + 1).toString() })}
              disabled={paginaActual >= totalPaginas}
            >
              Siguiente <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}