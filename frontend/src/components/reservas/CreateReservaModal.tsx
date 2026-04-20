"use client"

import { useState, useEffect } from "react"
import { useForm, useWatch, SubmitHandler } from "react-hook-form"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, Save, Calendar, User } from "lucide-react"
import { createReserva } from "@/actions/reservas"
import { getHoteles } from "@/services/hotelServices"
import { getHabitaciones } from "@/services/habitacionServices"
import { HotelDTO, HabitacionDTO, EstadoReserva, ActionResponse } from "@/types/api"
import { toast } from "sonner"

interface CreateReservaValues {
  hotelId: string;
  habitacionId: string;
  nombreHuesped: string;
  fechaEntrada: string;
  fechaSalida: string;
  estado: EstadoReserva;
}

export function CreateReservaModal() {
  const [open, setOpen] = useState(false)
  const [loadingHabitaciones, setLoadingHabitaciones] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [hoteles, setHoteles] = useState<HotelDTO[]>([])
  const [habitaciones, setHabitaciones] = useState<HabitacionDTO[]>([])

  const { register, handleSubmit, reset, control, setValue } = useForm<CreateReservaValues>({
    defaultValues: { 
      estado: EstadoReserva.Pendiente, 
      hotelId: "", 
      habitacionId: "",
      nombreHuesped: "",
      fechaEntrada: "",
      fechaSalida: ""
    }
  })

  // Observamos el cambio de hotel para cargar habitaciones
  const selectedHotelId = useWatch({ control, name: "hotelId" })

  // SOLUCIÓN AL ERROR: Manejamos la apertura/cierre por evento, no por efecto
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      // Carga inicial al abrir
      getHoteles({ cantidad: 100 }).then(res => setHoteles(res.datos))
    } else {
      // Limpieza al cerrar (Fuera del useEffect evita la cascada)
      reset()
      setHabitaciones([])
    }
  }

  // Efecto para habitaciones: Este es válido porque reacciona a un cambio de valor del formulario
  useEffect(() => {
    if (!selectedHotelId) return
  
    const cargarHabitaciones = async () => {
      setLoadingHabitaciones(true)
      setValue("habitacionId", "")
      try {
        const res = await getHabitaciones({ hotelId: Number(selectedHotelId), cantidad: 100 })
        setHabitaciones(res.datos)
      } catch {
        toast.error("Error al cargar habitaciones")
      } finally {
        setLoadingHabitaciones(false)
      }
    }
  
    cargarHabitaciones()
  }, [selectedHotelId, setValue])

  const onSubmit: SubmitHandler<CreateReservaValues> = async (data) => {
    setIsSubmitting(true)
    const formData = new FormData()
    
    // Tipado estricto para el envío
    formData.append("habitacionId", data.habitacionId)
    formData.append("nombreHuesped", data.nombreHuesped)
    formData.append("fechaEntrada", data.fechaEntrada)
    formData.append("fechaSalida", data.fechaSalida)
    formData.append("estado", data.estado)

    try {
      const res: ActionResponse = await createReserva(formData)
      if (res.success) {
        toast.success("Reserva creada con éxito")
        handleOpenChange(false) // Cerramos y reseteamos
      } else {
        toast.error(res.error || "Error al crear reserva")
      }
    } catch {
      toast.error("Error de comunicación con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95">
          <Plus className="h-4 w-4 mr-2" /> Nueva Reserva
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-950 font-black uppercase tracking-tighter">
            <Calendar className="h-5 w-5 text-indigo-600" /> Registrar Estancia
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Campo Huésped */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Huésped Principal</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                {...register("nombreHuesped", { required: "El nombre es obligatorio" })} 
                className="pl-9 focus-visible:ring-indigo-500" 
                placeholder="Nombre completo" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Selector de Hotel */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">1. Seleccionar Hotel</Label>
              <select 
                {...register("hotelId", { required: true })} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Seleccione...</option>
                {hoteles.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
              </select>
            </div>

            {/* Selector de Habitación (Cascada) */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2. Habitación Física</Label>
              <select 
                {...register("habitacionId", { required: true })} 
                disabled={!selectedHotelId || loadingHabitaciones} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 transition-colors"
              >
                <option value="">{loadingHabitaciones ? "Cargando..." : "N° Hab."}</option>
                {habitaciones.map(hab => (
                  <option key={hab.id} value={hab.id}>
                    {hab.numero} — {hab.tipoNombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Entrada</Label>
              <Input 
                type="date" 
                {...register("fechaEntrada", { required: true })} 
                className="focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Salida</Label>
              <Input 
                type="date" 
                {...register("fechaSalida", { required: true })} 
                className="focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold uppercase text-xs py-6 shadow-md shadow-indigo-100"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><Save className="h-4 w-4 mr-2" /> Confirmar Reserva</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}