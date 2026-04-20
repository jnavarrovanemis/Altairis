"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Loader2, Save, X } from "lucide-react"
import { HabitacionDTO, ActionResponse, EstadoHabitacion, TipoHabitacionDTO } from "@/types/api"
import { toast } from "sonner"
import { updateHabitacion } from "@/actions/habitaciones"
import { getTiposHabitacion } from "@/services/tipoHabitacionService"

interface EditProps {
  habitacion: HabitacionDTO
}

interface EditFormValues {
  numero: string;
  estado: EstadoHabitacion;
  tipoHabitacionId: number;
}

export function EditHabitacionModal({ habitacion }: EditProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingTipos, setLoadingTipos] = useState(false)
  const [tipos, setTipos] = useState<TipoHabitacionDTO[]>([])

  const { register, handleSubmit} = useForm<EditFormValues>({
    defaultValues: {
      numero: habitacion.numero,
      estado: habitacion.estado as EstadoHabitacion,
      tipoHabitacionId: habitacion.tipoHabitacionId
    }
  })

  // Lógica de filtrado por pertenencia de Hotel
  useEffect(() => {
    if (open) {
      const loadAndFilterTipos = async () => {
        setLoadingTipos(true)
        try {
          const res = await getTiposHabitacion({ cantidad: 500 })
          
          // 1. Encontramos el hotelId del tipo actual de la habitación
          const tipoActual = res.datos.find(t => t.id === habitacion.tipoHabitacionId)
          
          if (tipoActual) {
            // 2. Filtramos para mostrar solo categorías del MISMO hotel
            const filtrados = res.datos.filter(t => t.hotelId === tipoActual.hotelId)
            setTipos(filtrados)
          } else {
            setTipos(res.datos) // Fallback si algo falla
          }
        } catch {
          toast.error("Error al cargar categorías del hotel")
        } finally {
          setLoadingTipos(false)
        }
      }

      loadAndFilterTipos()
    }
  }, [open, habitacion.tipoHabitacionId])

  const onSubmit = async (data: EditFormValues) => {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("numero", data.numero)
    formData.append("tipoHabitacionId", data.tipoHabitacionId.toString())
    formData.append("estado", data.estado)

    try {
      const res: ActionResponse = await updateHabitacion(habitacion.id, formData)
      if (res.success) {
        toast.success("Cambios guardados", {
          description: `Unidad ${data.numero} actualizada correctamente.`
        })
        setOpen(false)
      } else {
        toast.error(res.error || "Error al actualizar")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-950 font-black uppercase tracking-tighter">
            <Pencil className="h-5 w-5 text-indigo-600" /> Editar Unidad {habitacion.numero}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          
          {/* Campo Tipo / Categoría (Filtrado) */}
          <div className="grid gap-2">
            <Label className="font-bold text-slate-700 text-xs uppercase tracking-widest">
              Categoría (Solo {habitacion.hotelNombre})
            </Label>
            <select 
              {...register("tipoHabitacionId", { valueAsNumber: true })}
              disabled={loadingTipos}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
            >
              {loadingTipos ? (
                <option>Cargando categorías...</option>
              ) : (
                tipos.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nombre} — ${t.precioBase}
                  </option>
                ))
              )}
            </select>
            <p className="text-[10px] text-slate-400 italic">
              * Solo se muestran categorías pertenecientes a la misma sede.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700 text-xs uppercase tracking-widest">N° Unidad</Label>
              <Input 
                {...register("numero")} 
                className="focus-visible:ring-indigo-500 font-semibold"
              />
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700 text-xs uppercase tracking-widest">Estado</Label>
              <select 
                {...register("estado")} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Disponible">Disponible</option>
                <option value="Ocupada">Ocupada</option>
                <option value="Limpieza">Limpieza</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-slate-500 hover:bg-slate-100">
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || loadingTipos} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] shadow-lg shadow-indigo-100"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} 
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}