"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, Save, Building2, DollarSign, Users } from "lucide-react"
import { toast } from "sonner"
import { HotelDTO, TipoHabitacionPayload, ActionResponse } from "@/types/api"
import { createTipoHabitacion } from "@/actions/tiposHabitacion"
import { getHoteles } from "@/services/hotelServices"

export function CreateTipoHabitacionModal() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoteles, setHoteles] = useState<HotelDTO[]>([])
  const [loadingHoteles, setLoadingHoteles] = useState(false)

  // Destructuramos errors y ahora lo usaremos en el JSX
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TipoHabitacionPayload>({
    defaultValues: {
      hotelId: 0,
      nombre: "",
      precioBase: 0,
      capacidad: 1,
    }
  })

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen)
    
    if (!isOpen) {
      reset()
      return
    }

    try {
      setLoadingHoteles(true)
      const res = await getHoteles({ cantidad: 100, activo: true })
      setHoteles(res.datos)
    } catch (error) {
      console.error("Error al cargar hoteles:", error)
      toast.error("Error", { description: "No se pudieron cargar los hoteles." })
    } finally {
      setLoadingHoteles(false)
    }
  }

  const onSubmit = async (data: TipoHabitacionPayload) => {
    if (data.hotelId === 0) return toast.error("Selecciona un hotel")

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("hotelId", data.hotelId.toString())
    formData.append("nombre", data.nombre)
    formData.append("precioBase", data.precioBase.toString())
    formData.append("capacidad", data.capacidad.toString())

    try {
      const result: ActionResponse = await createTipoHabitacion(formData)
      if (result.success) {
        toast.success("Categoría creada")
        setOpen(false)
        reset()
      } else {
        toast.error(result.error || "Error")
      }
    } catch (e) {
      console.error("Error de red:", e)
      toast.error("Error de red")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg">
          <Plus className="h-4 w-4 mr-2" /> Nueva Categoría
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-600" />
            Registrar Tipo de Habitación
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* Selector de Hotel */}
          <div className="grid gap-2">
            <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1">
              <Building2 className="h-3 w-3" /> Hotel Destino
            </Label>
            <div className="relative">
              <select 
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 outline-none cursor-pointer disabled:opacity-50 ${errors.hotelId ? 'border-red-500 focus:ring-red-500' : 'border-input focus:ring-indigo-500'}`}
                disabled={loadingHoteles}
                {...register("hotelId", { valueAsNumber: true, min: { value: 1, message: "Selecciona un hotel" } })}
              >
                <option value={0}>
                  {loadingHoteles ? "Cargando hoteles..." : "Seleccionar un hotel..."}
                </option>
                {hoteles.map(h => (
                  <option key={h.id} value={h.id}>{h.nombre}</option>
                ))}
              </select>
              {errors.hotelId && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.hotelId.message}</p>}
            </div>
          </div>

          {/* Nombre */}
          <div className="grid gap-2">
            <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Nombre del Tipo</Label>
            <Input 
              placeholder="Ej: Suite, Standard..." 
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className={errors.nombre ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-indigo-500"}
            />
            {errors.nombre && <p className="text-[10px] text-red-500 font-bold">{errors.nombre.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio */}
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Precio ($)
              </Label>
              <Input 
                type="number" 
                step="0.01"
                {...register("precioBase", { valueAsNumber: true, min: { value: 0.01, message: "Mínimo 0.01" } })} 
                className={errors.precioBase ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-indigo-500"}
              />
              {errors.precioBase && <p className="text-[10px] text-red-500 font-bold">{errors.precioBase.message}</p>}
            </div>

            {/* Capacidad */}
            <div className="grid gap-2">
              <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1">
                <Users className="h-3 w-3" /> Capacidad
              </Label>
              <Input 
                type="number" 
                {...register("capacidad", { valueAsNumber: true, min: { value: 1, message: "Mínimo 1" } })} 
                className={errors.capacidad ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-indigo-500"}
              />
              {errors.capacidad && <p className="text-[10px] text-red-500 font-bold">{errors.capacidad.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || loadingHoteles} className="bg-indigo-600 hover:bg-indigo-700">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Guardar</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}