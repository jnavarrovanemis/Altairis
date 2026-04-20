"use client"

import { useState } from "react"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { deleteTipoHabitacion } from "@/actions/tiposHabitacion"
import { ActionResponse } from "@/types/api"

interface DeleteProps {
  id: number
  nombre: string
}

export function DeleteTipoHabitacionButton({ id, nombre }: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const onDelete = async () => {
    try {
      setIsDeleting(true)
      const result: ActionResponse = await deleteTipoHabitacion(id)

      if (result.error) throw new Error(result.error)

      toast.success("Categoría eliminada", {
        description: `"${nombre}" ha sido removida del catálogo.`
      })
    } catch (error) {
      const e = error as Error
      toast.error(e.message || "No se pudo eliminar la categoría")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Estás a punto de borrar permanentemente la categoría <strong>{nombre}</strong>. 
            Esta acción no se puede deshacer y fallará si hay habitaciones físicas vinculadas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault() // Prevenimos el cierre automático para manejar el loading
              onDelete()
            }} 
            className="bg-rose-600 hover:bg-rose-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Eliminando...</>
            ) : (
              "Confirmar Eliminación"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}