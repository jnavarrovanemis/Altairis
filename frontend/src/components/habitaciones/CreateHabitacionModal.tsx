"use client"

import { useState, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, Save, BedDouble } from "lucide-react"
import { 
  HotelDTO, 
  TipoHabitacionDTO, 
  ActionResponse, 
  EstadoHabitacion 
} from "@/types/api"
import { toast } from "sonner"
import { createHabitacion } from "@/actions/habitaciones"
import { getHoteles } from "@/services/hotelServices"
import { getTiposHabitacion } from "@/services/tipoHabitacionService"

// Definimos la interfaz del formulario para eliminar el 'any'
interface CreateFormValues {
  hotelId: string;
  numero: string;
  estado: EstadoHabitacion;
  tipoHabitacionId: string;
}

export function CreateHabitacionModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [hoteles, setHoteles] = useState<HotelDTO[]>([])
  const [todosLosTipos, setTodosLosTipos] = useState<TipoHabitacionDTO[]>([])

  const { register, handleSubmit, reset, control} = useForm<CreateFormValues>({
    defaultValues: {
      numero: "",
      estado: "Disponible" as EstadoHabitacion, // Solución al error ts(2322)
      tipoHabitacionId: "",
      hotelId: ""
    }
  })

  const selectedHotelId = useWatch({ control, name: "hotelId" })

  // Filtrado derivado (No genera renders infinitos)
  const tiposFiltrados = todosLosTipos.filter(t => t.hotelId === Number(selectedHotelId))

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true)
        try {
          const [h, t] = await Promise.all([
            getHoteles({ cantidad: 100 }), 
            getTiposHabitacion({ cantidad: 500 })
          ])
          setHoteles(h.datos)
          setTodosLosTipos(t.datos)
        } catch {
          toast.error("Error al sincronizar dependencias")
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    } else {
      reset()
    }
  }, [open, reset])

  const onSubmit = async (data: CreateFormValues) => {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("numero", data.numero)
    formData.append("tipoHabitacionId", data.tipoHabitacionId)
    formData.append("estado", data.estado)

    const res: ActionResponse = await createHabitacion(formData)
    
    if (res.success) {
      toast.success("Habitación registrada correctamente")
      setOpen(false)
    } else {
      toast.error(res.error || "Fallo en el registro")
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold uppercase text-xs tracking-widest">
          <Plus className="h-4 w-4 mr-2" /> Nueva Habitación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-950 font-black uppercase tracking-tighter">
            <BedDouble className="h-5 w-5 text-indigo-600" /> Registrar Unidad
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label className="font-bold text-slate-700 text-xs uppercase tracking-widest">1. Hotel / Sede</Label>
            <select 
              {...register("hotelId", { required: true })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">{loading ? "Cargando sedes..." : "Seleccione..."}</option>
              {hoteles.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
            </select>
          </div>

          <div className="grid gap-2">
            <Label className="font-bold text-slate-700 text-xs uppercase tracking-widest">2. Categoría</Label>
            <select 
              {...register("tipoHabitacionId", { required: true })}
              disabled={!selectedHotelId}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none disabled:bg-slate-50"
            >
              <option value="">Seleccione tipo...</option>
              {tiposFiltrados.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700 text-xs uppercase tracking-widest">N° Unidad</Label>
              <Input {...register("numero", { required: true })} placeholder="101" />
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700 text-xs uppercase tracking-widest">Estado</Label>
              <select {...register("estado")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none">
                <option value="Disponible">Disponible</option>
                <option value="Limpieza">Limpieza</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isSubmitting || loading} className="w-full bg-indigo-600 font-bold uppercase text-xs py-6">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} 
              Confirmar Registro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}