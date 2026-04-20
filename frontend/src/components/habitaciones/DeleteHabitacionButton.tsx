"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { deleteHabitacion } from "@/actions/habitaciones"
import { toast } from "sonner"

export function DeleteHabitacionButton({ id, numero }: { id: number, numero: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar la habitación ${numero}?`)) return
    
    setIsDeleting(true)
    try {
      await deleteHabitacion(id)
      toast.success(`Habitación ${numero} eliminada`)
    } catch {
      toast.error("No se pudo eliminar")
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
      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}