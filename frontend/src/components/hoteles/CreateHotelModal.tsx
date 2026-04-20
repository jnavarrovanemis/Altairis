"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { PlusCircle, Loader2, Save} from "lucide-react"
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
import { createHotel } from "@/actions/hoteles"
import { toast } from "sonner"
import { HotelPayload, ActionResponse } from "@/types/api"

export function CreateHotelModal() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Tipamos el formulario con HotelPayload
  const { register, handleSubmit, control, reset } = useForm<HotelPayload>({
    defaultValues: {
      nombre: "",
      ciudad: "",
      estrellas: 3,
      activo: true, // Por defecto, un hotel nuevo suele crearse activo
    }
  })

  const onSubmit = async (data: HotelPayload) => {
    setIsSubmitting(true)
    
    // Transformación profesional a FormData para la Server Action
    const formData = new FormData()
    formData.append("nombre", data.nombre)
    formData.append("ciudad", data.ciudad)
    formData.append("estrellas", data.estrellas.toString())
    formData.append("activo", String(data.activo))

    try {
      const result: ActionResponse = await createHotel(formData)
      
      if (result.success) {
        reset() // Limpiamos el formulario
        setOpen(false) // Cerramos el modal
        // Aquí podrías disparar un toast de éxito
      } else {
        toast.error(result.error || "Ocurrió un error al crear el hotel")
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

  // Si se cierra el modal manualmente, podemos elegir si limpiar o no.
  // Lo más limpio es resetearlo si se cancela la operación.
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset()
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 bg-slate-900 hover:bg-slate-800 transition-all shadow-md">
          <PlusCircle className="h-4 w-4" />
          Registrar Hotel
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-emerald-600" />
            Nuevo Hotel Altairis
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Ingresa los detalles básicos para dar de alta una nueva sede en el sistema.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4">
            {/* Campo: Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="create-nombre" className="text-sm font-semibold">Nombre del Hotel</Label>
              <Input 
                id="create-nombre" 
                {...register("nombre", { required: "El nombre es obligatorio" })} 
                placeholder="Ej. Hotel Altairis Valencia"
              />
            </div>

            {/* Campo: Ciudad */}
            <div className="grid gap-2">
              <Label htmlFor="create-ciudad" className="text-sm font-semibold">Ciudad / Localidad</Label>
              <Input 
                id="create-ciudad" 
                {...register("ciudad", { required: "La ciudad es obligatoria" })} 
                placeholder="Ej. Valencia, Carabobo"
              />
            </div>

            {/* Campo: Estrellas */}
            <div className="grid gap-2">
              <Label htmlFor="create-estrellas" className="text-sm font-semibold">Categoría (Estrellas)</Label>
              <Input 
                id="create-estrellas" 
                type="number" 
                min="1" 
                max="5" 
                {...register("estrellas", { valueAsNumber: true })} 
              />
            </div>

            {/* Campo: Estado con Controller */}
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-emerald-100 bg-emerald-50/30">
              <Controller
                control={control}
                name="activo"
                render={({ field }) => (
                  <Checkbox 
                    id="create-activo" 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="create-activo" 
                  className="text-sm font-bold leading-none cursor-pointer"
                >
                  Habilitar inmediatamente
                </Label>
                <p className="text-[12px] text-muted-foreground">
                  El hotel aparecerá activo en el dashboard al finalizar.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="h-4 w-4 mr-2" /> Crear Hotel</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}