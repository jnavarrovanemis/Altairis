"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TipoHabitacionDTO } from "@/types/api"
import { EditTipoHabitacionModal } from "./EditTipoHabitacionModal"
import { DeleteTipoHabitacionButton } from "./DeleteTipoHabitacionButton"
import { 
  ArrowUpDown, 
  ArrowUp,
  ArrowDown,
  Search, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Users,
  Building2,
  DollarSign
} from "lucide-react"

interface Props {
  data: TipoHabitacionDTO[]
  paginaActual: number
  totalPaginas: number
  totalRegistros: number
}

export function TiposHabitacionDataTable({ data, paginaActual, totalPaginas, totalRegistros }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- VALORES DESDE LA URL (Source of Truth) ---
  const currentNombre = searchParams.get("nombre") || ""
  const currentCapacidad = searchParams.get("capacidad") || ""
  const currentPrecioMin = searchParams.get("precioMin") || ""
  const currentPrecioMax = searchParams.get("precioMax") || ""
  const currentOrden = searchParams.get("orden") || "nombre"
  const currentDireccion = searchParams.get("direccion") || "asc"
  const currentCantidad = searchParams.get("cantidad") || "10"

  // --- ESTADO LOCAL PARA EL TIPEADO (Optimización de UI) ---
  const [nombreInput, setNombreInput] = useState(currentNombre)
  const [minInput, setMinInput] = useState(currentPrecioMin)
  const [maxInput, setMaxInput] = useState(currentPrecioMax)

  // Función central para actualizar la URL
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Si aplicamos un filtro nuevo, volvemos a la página 1
    if (!updates.pagina && !updates.orden && !updates.direccion) {
      params.set("pagina", "1")
    }

    router.push(`?${params.toString()}`)
  }

  const toggleSort = (column: string) => {
    const nextDir = currentOrden === column && currentDireccion === "asc" ? "desc" : "asc"
    updateQueryParams({ orden: column, direccion: nextDir })
  }

  const formatPrecio = (p: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(p)
  }

  return (
    <div className="space-y-4">
      
      {/* PANEL DE FILTROS: Diseño Enterprise */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        
        {/* Filtro: Nombre */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              key={`nombre-${currentNombre}`} // Fuerza el reset visual al limpiar filtros
              defaultValue={currentNombre}
              placeholder="Ej: Suite, Standard..." 
              className="pl-8 focus-visible:ring-indigo-500" 
              onChange={(e) => setNombreInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateQueryParams({ nombre: nombreInput })}
            />
          </div>
        </div>

        {/* Filtro: Capacidad */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacidad</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer shadow-sm"
            value={currentCapacidad}
            onChange={(e) => updateQueryParams({ capacidad: e.target.value })}
          >
            <option value="">Todas</option>
            {[1, 2, 3, 4, 5, 6, 8].map(n => (
              <option key={n} value={n.toString()}>{n} {n === 1 ? 'Persona' : 'Personas'}</option>
            ))}
          </select>
        </div>

        {/* Filtro: Precios (Controlados por URL) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> Rango de Precio
          </label>
          <div className="flex gap-2">
            <Input 
              key={`min-${currentPrecioMin}`}
              type="number" 
              placeholder="Mín" 
              defaultValue={currentPrecioMin}
              onChange={(e) => setMinInput(e.target.value)}
              className="focus-visible:ring-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && updateQueryParams({ precioMin: minInput })}
            />
            <Input 
              key={`max-${currentPrecioMax}`}
              type="number" 
              placeholder="Máx" 
              defaultValue={currentPrecioMax}
              onChange={(e) => setMaxInput(e.target.value)}
              className="focus-visible:ring-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && updateQueryParams({ precioMax: maxInput })}
            />
          </div>
        </div>

        {/* Acción: Restablecer */}
        <div className="flex items-end">
          <Button 
            variant="ghost" 
            className="w-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 font-bold text-xs uppercase tracking-tighter"
            onClick={() => {
              setNombreInput("");
              setMinInput("");
              setMaxInput("");
              router.push("/tipos-habitacion");
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Restablecer filtros
          </Button>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-bold text-slate-700">Hotel</TableHead>
              <TableHead onClick={() => toggleSort("nombre")} className="cursor-pointer font-bold text-slate-700 select-none">
                <div className="flex items-center gap-2">
                  Categoría
                  {currentOrden === "nombre" ? (currentDireccion === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                </div>
              </TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Capacidad</TableHead>
              <TableHead onClick={() => toggleSort("precio")} className="cursor-pointer font-bold text-slate-700 select-none">
                <div className="flex items-center gap-2">
                  Precio Base
                  {currentOrden === "precio" ? (currentDireccion === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                </div>
              </TableHead>
              <TableHead className="text-right font-bold text-slate-700 px-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {data.length > 0 ? (
              data.map((h) => (
                <TableRow key={h.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <div className="p-1.5 bg-slate-100 rounded-md">
                        <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      {h.hotelNombre}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">{h.nombre}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5 text-slate-600 bg-slate-100 py-1 px-2 rounded-lg w-fit mx-auto">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs font-bold">{h.capacidad} pax</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-indigo-600">
                    {formatPrecio(h.precioBase)}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-1">
                      <EditTipoHabitacionModal habitacion={h} />
                      <DeleteTipoHabitacionButton id={h.id} nombre={h.nombre} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-slate-400">
                   <p className="font-medium">No se encontraron resultados en el catálogo.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-tighter text-slate-500">
          <span>Total: <span className="text-indigo-600 font-black">{totalRegistros}</span> ítems</span>
          <div className="flex items-center gap-2">
            <span>Mostrar:</span>
            <select
              className="h-8 w-16 rounded-md border bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={currentCantidad}
              onChange={(e) => updateQueryParams({ cantidad: e.target.value })}
            >
              {["5", "10", "20", "50"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase">
            Página <span className="text-slate-900">{paginaActual}</span> de {totalPaginas}
          </p>
          <div className="flex gap-1">
            <Button 
              variant="outline" size="sm" 
              onClick={() => updateQueryParams({ pagina: (paginaActual - 1).toString() })} 
              disabled={paginaActual <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" size="sm" 
              onClick={() => updateQueryParams({ pagina: (paginaActual + 1).toString() })} 
              disabled={paginaActual >= totalPaginas}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}