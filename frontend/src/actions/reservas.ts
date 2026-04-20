"use server"

import { revalidatePath } from "next/cache"
import { apiRequest } from "@/lib/api-client"
import { 
  EstadoReserva, 
  ReservaDTO, 
  ActionResponse 
} from "../types/api"

/**
 * Crea una nueva reserva en el sistema
 */
export async function createReserva(formData: FormData): Promise<ActionResponse> {
  const payload = {
    habitacionId: Number(formData.get("habitacionId")),
    nombreHuesped: String(formData.get("nombreHuesped")),
    fechaEntrada: String(formData.get("fechaEntrada")),
    fechaSalida: String(formData.get("fechaSalida")),
    estado: (formData.get("estado") as EstadoReserva) || EstadoReserva.Pendiente,
  };

  try {
    await apiRequest<ReservaDTO>("/reservas", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    revalidatePath("/reservas");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message || "No se pudo procesar la reserva" };
  }
}

/**
 * Actualización completa de una reserva (PUT)
 * Útil para corregir nombres, fechas o cambiar de habitación física
 */
export async function updateReserva(id: number, formData: FormData): Promise<ActionResponse> {
    const payload = {
      id: id, // Verificar que este ID coincida con el de la URL para .NET
      habitacionId: Number(formData.get("habitacionId")),
      nombreHuesped: String(formData.get("nombreHuesped")),
      fechaEntrada: String(formData.get("fechaEntrada")),
      fechaSalida: String(formData.get("fechaSalida")),
      estado: formData.get("estado") as EstadoReserva,
    };
  
    try {
      await apiRequest<void>(`/reservas/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
  
      revalidatePath("/reservas");
      return { success: true };
    } catch (e) {
      const error = e as Error;
      return { 
        success: false, 
        error: error.message || "Error al actualizar los datos en el servidor" 
      };
    }
  }

/**
 * Actualiza únicamente el estado operativo (PATCH)
 * Ideal para flujos de Check-In, Check-Out o Cancelaciones rápidas
 */
export async function updateEstadoReserva(id: number, nuevoEstado: EstadoReserva): Promise<ActionResponse> {
  try {
    await apiRequest<void>(`/reservas/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify(nuevoEstado),
    });

    revalidatePath("/reservas");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message || "No se pudo cambiar el estado" };
  }
}

/**
 * Elimina una reserva del sistema
 */
export async function deleteReserva(id: number): Promise<ActionResponse> {
  try {
    await apiRequest<void>(`/reservas/${id}`, { method: "DELETE" });
    
    revalidatePath("/reservas");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message || "Error al eliminar la reserva" };
  }
}