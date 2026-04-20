"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, // Soluciona el warning de aria-describedby
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Loader2, Save, X } from "lucide-react"
import { ReservaDTO, ActionResponse, EstadoReserva } from "@/types/api"
import { updateReserva } from "@/actions/reservas"
import { toast } from "sonner"

interface EditProps {
  reserva: ReservaDTO
}

interface EditReservaFormValues {
  nombreHuesped: string;
  estado: EstadoReserva;
  fechaEntrada: string;
  fechaSalida: string;
  habitacionId: number;
}

export function EditReservaModal({ reserva }: EditProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset } = useForm<EditReservaFormValues>({
    defaultValues: {
      nombreHuesped: reserva.nombreHuesped,
      estado: reserva.estado as EstadoReserva,
      // Fallback seguro para el split de fechas
      fechaEntrada: reserva.fechaEntrada ? String(reserva.fechaEntrada).split('T')[0] : "",
      fechaSalida: reserva.fechaSalida ? String(reserva.fechaSalida).split('T')[0] : "",
      // Blindaje: Si habitacionId es undefined en el DTO, usamos 0
      habitacionId: reserva.habitacionId || 0
    }
  })

  const onSubmit: SubmitHandler<EditReservaFormValues> = async (data) => {
    setIsSubmitting(true)
    
    const formData = new FormData()
    formData.append("nombreHuesped", data.nombreHuesped)
    formData.append("estado", data.estado)
    formData.append("fechaEntrada", data.fechaEntrada)
    formData.append("fechaSalida", data.fechaSalida)
    
    // Aquí es donde ocurría el error: ahora data.habitacionId siempre tendrá un valor
    formData.append("habitacionId", (data.habitacionId ?? 0).toString())

    try {
      const res: ActionResponse = await updateReserva(reserva.id, formData)
      if (res.success) {
        toast.success("Reserva actualizada con éxito")
        setOpen(false)
      } else {
        toast.error(res.error || "No se pudo actualizar la reserva")
      }
    } catch {
      toast.error("Error crítico de comunicación con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if(!val) reset(); setOpen(val); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-indigo-950 font-black uppercase tracking-tighter">
            Editar Reserva #{reserva.id}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-xs font-medium">
            Ajuste los datos del huésped o el estado operativo de la estancia.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre del Huésped</Label>
            <Input {...register("nombreHuesped", { required: true })} className="focus-visible:ring-indigo-500" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</Label>
            <select 
              {...register("estado")} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {Object.values(EstadoReserva).map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entrada</Label>
              <Input type="date" {...register("fechaEntrada")} className="focus-visible:ring-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salida</Label>
              <Input type="date" {...register("fechaSalida")} className="focus-visible:ring-indigo-500" />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-slate-500 font-bold uppercase text-xs">
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] font-bold uppercase text-xs">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} 
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}