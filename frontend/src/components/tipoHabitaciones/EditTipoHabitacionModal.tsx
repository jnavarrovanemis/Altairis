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
import { Pencil, Loader2, Save, X, DollarSign, Users } from "lucide-react"
import { TipoHabitacionDTO, TipoHabitacionPayload, ActionResponse } from "@/types/api"
import { toast } from "sonner"
import { updateTipoHabitacion } from "@/actions/tiposHabitacion"

interface EditProps {
  habitacion: TipoHabitacionDTO
}

export function EditTipoHabitacionModal({ habitacion }: EditProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializamos el formulario con los tipos correctos
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TipoHabitacionPayload>({
    defaultValues: {
      hotelId: habitacion.hotelId,
      nombre: habitacion.nombre,
      precioBase: habitacion.precioBase,
      capacidad: habitacion.capacidad,
    }
  })

  const onSubmit = async (data: TipoHabitacionPayload) => {
    setIsSubmitting(true)
    
    // Mapeo a FormData para mantener la consistencia con el api-client
    const formData = new FormData()
    formData.append("hotelId", data.hotelId.toString())
    formData.append("nombre", data.nombre)
    formData.append("precioBase", data.precioBase.toString())
    formData.append("capacidad", data.capacidad.toString())

    try {
      const result: ActionResponse = await updateTipoHabitacion(habitacion.id, formData)

      if (result.success) {
        toast.success("Categoría actualizada", {
          description: `Se han guardado los cambios en ${data.nombre}`
        })
        setOpen(false)
      } else {
        toast.error(result.error || "Error al actualizar")
      }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message); // Aquí ya tienes autocompletado
            } else {
            console.error("Error inesperado:", error);
            }
      toast.error("Error crítico de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Si cancelamos, reseteamos a los valores originales del DTO
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset()
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-950">
            <Pencil className="h-5 w-5 text-indigo-600" />
            Editar Categoría
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* Nombre */}
          <div className="grid gap-2">
            <Label htmlFor="edit-nombre" className="font-bold text-slate-700 text-xs uppercase">
              Nombre de la Categoría
            </Label>
            <Input 
              id="edit-nombre" 
              {...register("nombre", { required: "El nombre es obligatorio" })} 
              className={errors.nombre ? "border-red-500" : "focus-visible:ring-indigo-500"}
            />
            {errors.nombre && <span className="text-[10px] text-red-500 font-bold">{errors.nombre.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio */}
            <div className="grid gap-2">
              <Label htmlFor="edit-precio" className="font-bold text-slate-700 text-xs uppercase">
                Precio Base ($)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="edit-precio" 
                  type="number" 
                  step="0.01"
                  {...register("precioBase", { valueAsNumber: true, required: true })} 
                  className="pl-8 focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            {/* Capacidad */}
            <div className="grid gap-2">
              <Label htmlFor="edit-pax" className="font-bold text-slate-700 text-xs uppercase">
                Capacidad (Pax)
              </Label>
              <div className="relative">
                <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="edit-pax" 
                  type="number" 
                  {...register("capacidad", { valueAsNumber: true, required: true })} 
                  className="pl-8 focus-visible:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="text-slate-500"
            >
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><Save className="h-4 w-4 mr-2" /> Guardar Cambios</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}