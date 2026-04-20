"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { deleteReserva } from "@/actions/reservas"
import { toast } from "sonner"

export function DeleteReservaButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.")) return
    
    setIsDeleting(true)
    try {
      const res = await deleteReserva(id)
      if (res.success) {
        toast.success("Reserva eliminada correctamente")
      } else {
        toast.error(res.error || "Error al eliminar")
      }
    } catch {
      toast.error("Error de comunicación con el servidor")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}