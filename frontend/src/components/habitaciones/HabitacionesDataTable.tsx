"use client"

import { useState, useEffect } from "react"
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
import { HabitacionDTO, HotelDTO } from "@/types/api"
import { getHoteles } from "@/services/hotelServices"
import { EditHabitacionModal } from "@/components/habitaciones/EditHabitacionModal"
import { DeleteHabitacionButton } from "@/components/habitaciones/DeleteHabitacionButton"
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Users 
} from "lucide-react"
import { cn } from "@/lib/utils"

const MAPA_ESTADOS: Record<string, { color: string, dot: string }> = {
  "Disponible": { color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  "Ocupada": { color: "text-rose-700 bg-rose-50 border-rose-100", dot: "bg-rose-500" },
  "Mantenimiento": { color: "text-slate-700 bg-slate-50 border-slate-200", dot: "bg-slate-500" },
  "Limpieza": { color: "text-amber-700 bg-amber-50 border-amber-100", dot: "bg-amber-500" },
};

interface Props {
  data: HabitacionDTO[]
  paginaActual: number
  totalPaginas: number
  totalRegistros: number
}

export function HabitacionesDataTable({ data, paginaActual, totalPaginas, totalRegistros }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- VALORES DE URL ---
  const currentNumero = searchParams.get("numero") || ""
  const currentEstado = searchParams.get("estado") || ""
  const currentHotelId = searchParams.get("hotelId") || ""
  const currentOrden = searchParams.get("orden") || "numero"
  const currentDireccion = searchParams.get("direccion") || "asc"
  const currentCantidad = searchParams.get("cantidad") || "10"

  // --- ESTADOS LOCALES ---
  const [numeroInput, setNumeroInput] = useState(currentNumero)
  const [hoteles, setHoteles] = useState<HotelDTO[]>([])
  const [loadingHoteles, setLoadingHoteles] = useState(false)

  // Carga de hoteles para el filtro
  useEffect(() => {
    const fetchHoteles = async () => {
      setLoadingHoteles(true)
      try {
        const res = await getHoteles({ cantidad: 100 })
        setHoteles(res.datos)
      } finally {
        setLoadingHoteles(false)
      }
    }
    fetchHoteles()
  }, [])

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== "") params.set(key, value)
      else params.delete(key)
    })
    
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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p)
  }

  return (
    <div className="space-y-4">
      
      {/* PANEL DE FILTROS: Diseño Enterprise */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        
        {/* N° Habitación */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">N° Habitación</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              key={`num-${currentNumero}`}
              defaultValue={currentNumero}
              placeholder="Ej: 101, 204..." 
              className="pl-8 focus-visible:ring-indigo-500" 
              onChange={(e) => setNumeroInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateQueryParams({ numero: numeroInput })}
            />
          </div>
        </div>

        {/* Estado Operativo */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer shadow-sm"
            value={currentEstado}
            onChange={(e) => updateQueryParams({ estado: e.target.value })}
          >
            <option value="">Todos los estados</option>
            {Object.keys(MAPA_ESTADOS).map(est => (
              <option key={est} value={est}>{est}</option>
            ))}
          </select>
        </div>

        {/* Filtro por Hotel (HABILITADO) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Building2 className="h-3 w-3" /> Sede / Hotel
          </label>
          <select 
            disabled={loadingHoteles}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer shadow-sm disabled:opacity-50"
            value={currentHotelId}
            onChange={(e) => updateQueryParams({ hotelId: e.target.value })}
          >
            <option value="">Todos los hoteles</option>
            {hoteles.map(h => (
              <option key={h.id} value={h.id.toString()}>{h.nombre}</option>
            ))}
          </select>
        </div>

        {/* Restablecer */}
        <div className="flex items-end">
          <Button 
            variant="ghost" 
            className="w-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 font-bold text-xs uppercase tracking-tighter"
            onClick={() => {
              setNumeroInput("");
              router.push("/habitaciones");
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
              <TableHead className="font-bold text-slate-700">Hotel / Sede</TableHead>
              <TableHead onClick={() => toggleSort("numero")} className="cursor-pointer font-bold text-slate-700 select-none">
                <div className="flex items-center gap-2">
                  Habitación
                  {currentOrden === "numero" ? (currentDireccion === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                </div>
              </TableHead>
              <TableHead className="font-bold text-slate-700">Categoría</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Estado</TableHead>
              <TableHead className="text-right font-bold text-slate-700 px-6">Precio / Noche</TableHead>
              <TableHead className="text-right font-bold text-slate-700 px-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {item.hotelNombre}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center h-7 w-12 rounded bg-slate-900 text-white font-black text-[10px] tracking-widest shadow-sm">
                      {item.numero}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700 text-xs">{item.tipoNombre}</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                        <Users className="h-3 w-3" /> {item.capacidad} pax
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "mx-auto flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider w-fit",
                      MAPA_ESTADOS[item.estado]?.color || "bg-slate-100 text-slate-600 border-slate-200"
                    )}>
                      <div className={cn("h-1.5 w-1.5 rounded-full", MAPA_ESTADOS[item.estado]?.dot || "bg-slate-400")} />
                      {item.estado}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6 font-mono font-bold text-indigo-600">
                    {formatPrecio(item.precioBase)}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-1">
                      <EditHabitacionModal habitacion={item} />
                      <DeleteHabitacionButton id={item.id} numero={item.numero} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-slate-400 font-medium">
                  No se encontraron unidades físicas con estos criterios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-tighter text-slate-500">
          <span>Total: <span className="text-indigo-600 font-black">{totalRegistros}</span> unidades</span>
          <div className="flex items-center gap-2">
            <span>Ver:</span>
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