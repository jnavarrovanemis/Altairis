"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Pencil, Loader2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { updateHotel } from "@/actions/hoteles"
import { HotelDTO, HotelPayload, ActionResponse } from "@/types/api"

interface EditHotelModalProps {
  hotel: HotelDTO
}

export function EditHotelModal({ hotel }: EditHotelModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, control, reset } = useForm<HotelPayload>({
    defaultValues: {
      nombre: hotel.nombre,
      ciudad: hotel.ciudad,
      estrellas: hotel.estrellas,
      activo: hotel.activo,
    }
  })

  const onSubmit = async (data: HotelPayload) => {
    setIsSubmitting(true)
    
    // Mapeo profesional a FormData
    const formData = new FormData()
    formData.append("nombre", data.nombre)
    formData.append("ciudad", data.ciudad)
    formData.append("estrellas", data.estrellas.toString())
    formData.append("activo", String(data.activo))

    try {
      const result: ActionResponse = await updateHotel(hotel.id, formData)
      
      if (result.success) {
        setOpen(false)
        // Opcional: toast.success("Hotel actualizado")
      } else {
        toast.error(result.error || "Error al actualizar")
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message); // Aquí ya tienes autocompletado
      } else {
        console.error("Error inesperado:", error);
      }
      toast.error("Error crítico en el servidor");
    } finally {
      setIsSubmitting(false)
    }
  }

  // Si cerramos el modal sin guardar, reseteamos a los valores originales del hotel
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
          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Pencil className="h-5 w-5 text-blue-600" />
            Editar Información del Hotel
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4">
            {/* Campo: Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="nombre" className="text-sm font-semibold">Nombre del Hotel</Label>
              <Input 
                id="nombre" 
                {...register("nombre", { required: "El nombre es obligatorio" })} 
                placeholder="Ej. Altairis Maracay"
                className="focus-visible:ring-blue-500"
              />
            </div>

            {/* Campo: Ciudad */}
            <div className="grid gap-2">
              <Label htmlFor="ciudad" className="text-sm font-semibold">Ciudad / Ubicación</Label>
              <Input 
                id="ciudad" 
                {...register("ciudad", { required: "La ciudad es obligatoria" })} 
                placeholder="Ej. Maracay, Aragua"
              />
            </div>

            {/* Campo: Estrellas */}
            <div className="grid gap-2">
              <Label htmlFor="estrellas" className="text-sm font-semibold">Categoría (1-5 estrellas)</Label>
              <Input 
                id="estrellas" 
                type="number" 
                min="1" 
                max="5" 
                {...register("estrellas", { valueAsNumber: true })} 
              />
            </div>

            {/* Campo: Estado (Usando Controller para el Checkbox de Shadcn) */}
            <div className="flex items-center space-x-3 p-3 rounded-lg border bg-slate-50/50">
              <Controller
                control={control}
                name="activo"
                render={({ field }) => (
                  <Checkbox 
                    id="activo" 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="activo" 
                  className="text-sm font-bold leading-none cursor-pointer"
                >
                  Hotel Activo
                </Label>
                <p className="text-[12px] text-muted-foreground">
                  Determina si el hotel es visible para nuevas reservas.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Guardando...</>
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