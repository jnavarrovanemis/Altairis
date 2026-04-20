"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ReservaDTO } from "@/types/api"
import { EditReservaModal } from "@/components/reservas/EditReservaModal"
import { DeleteReservaButton } from "@/components/reservas/DeleteReservaButton"
import { 
  Search, RotateCcw, ChevronLeft, ChevronRight, 
  User, Calendar, Building2, ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react"
import { cn } from "@/lib/utils"

// Configuración visual de estados (Design System Altairis)
const MAPA_ESTADOS_RESERVA: Record<string, { color: string, dot: string }> = {
  "Pendiente": { color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  "Confirmada": { color: "text-blue-700 bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  "CheckIn": { color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  "CheckOut": { color: "text-slate-700 bg-slate-50 border-slate-200", dot: "bg-slate-500" },
  "Cancelada": { color: "text-rose-700 bg-rose-50 border-rose-200", dot: "bg-rose-500" },
};

interface Props {
  data: ReservaDTO[]
  paginaActual: number
  totalPaginas: number
  totalRegistros: number
}

export function ReservasDataTable({ data, paginaActual, totalPaginas, totalRegistros }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- VALORES DE URL ---
  const currentHuesped = searchParams.get("huesped") || ""
  const currentEstado = searchParams.get("estado") || ""
  const currentOrden = searchParams.get("orden") || "fechaEntrada"
  const currentDireccion = searchParams.get("direccion") || "desc"
  const currentCantidad = searchParams.get("cantidad") || "10"

  const [huespedInput, setHuespedInput] = useState(currentHuesped)

  // --- FORMATEO NATIVO DE FECHAS (Zero Dependency) ---
  const formatFechaNative = (fechaStr: string) => {
    if (!fechaStr) return "---";
    const date = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-ES', { 
      day: '2-digit', 
      month: 'short' 
    }).format(date).replace('.', ''); // Quitamos el punto del mes (ej: abr.)
  };

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== "") params.set(key, value)
      else params.delete(key)
    })
    if (!updates.pagina) params.set("pagina", "1")
    router.push(`?${params.toString()}`)
  }

  const toggleSort = (column: string) => {
    const nextDir = currentOrden === column && currentDireccion === "asc" ? "desc" : "asc"
    updateQueryParams({ orden: column, direccion: nextDir })
  }

  return (
    <div className="space-y-4">
      
      {/* PANEL DE FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-xl bg-white shadow-sm border border-slate-100">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <User className="h-3 w-3" /> Huésped
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              key={`huesped-${currentHuesped}`}
              defaultValue={currentHuesped}
              placeholder="Buscar por nombre..." 
              className="pl-8 focus-visible:ring-indigo-500" 
              onChange={(e) => setHuespedInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateQueryParams({ huesped: huespedInput })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            value={currentEstado}
            onChange={(e) => updateQueryParams({ estado: e.target.value })}
          >
            <option value="">Todos los estados</option>
            {Object.keys(MAPA_ESTADOS_RESERVA).map(est => <option key={est} value={est}>{est}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Desde</label>
          <Input 
            type="date" 
            defaultValue={searchParams.get("desde") || ""}
            onChange={(e) => updateQueryParams({ desde: e.target.value })}
            className="focus-visible:ring-indigo-500"
          />
        </div>

        <div className="flex items-end">
          <Button 
            variant="ghost" 
            className="w-full text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase"
            onClick={() => router.push("/reservas")}
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-bold text-slate-800">Huésped</TableHead>
              <TableHead onClick={() => toggleSort("fechaEntrada")} className="cursor-pointer font-bold text-slate-800 select-none">
                <div className="flex items-center gap-2">
                   Estancia
                   {currentOrden === "fechaEntrada" ? (currentDireccion === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                </div>
              </TableHead>
              <TableHead className="font-bold text-slate-800">Habitación / Hotel</TableHead>
              <TableHead className="font-bold text-slate-800 text-center">Estado</TableHead>
              <TableHead className="text-right font-bold text-slate-800 px-6">Precio</TableHead>
              <TableHead className="text-right font-bold text-slate-800 px-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {data.length > 0 ? (
              data.map((res) => (
                <TableRow key={res.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-bold text-slate-900">{res.nombreHuesped}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-indigo-500" />
                        {formatFechaNative(res.fechaEntrada)} — {formatFechaNative(res.fechaSalida)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                        Temporada 2026
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">Hab. {res.numeroHabitacion}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Building2 className="h-2.5 w-2.5" /> {res.hotelNombre}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "mx-auto flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider w-fit",
                      MAPA_ESTADOS_RESERVA[res.estado]?.color
                    )}>
                      <div className={cn("h-1.5 w-1.5 rounded-full", MAPA_ESTADOS_RESERVA[res.estado]?.dot)} />
                      {res.estado}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6 font-mono font-black text-slate-900">
                    ${res.precioPorNoche}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-1">
                      <EditReservaModal reserva={res} />
                      <DeleteReservaButton id={res.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-slate-400 font-medium italic">
                  No hay reservas registradas en este periodo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-tighter text-slate-500">
          <span>Registros: <span className="text-indigo-600 font-black">{totalRegistros}</span></span>
          <select
            className="h-8 w-16 rounded-md border bg-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            value={currentCantidad}
            onChange={(e) => updateQueryParams({ cantidad: e.target.value })}
          >
            {["5", "10", "20", "50"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase">
            Página <span className="text-slate-900">{paginaActual}</span> de {totalPaginas}
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => updateQueryParams({ pagina: (paginaActual - 1).toString() })} disabled={paginaActual <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => updateQueryParams({ pagina: (paginaActual + 1).toString() })} disabled={paginaActual >= totalPaginas}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}