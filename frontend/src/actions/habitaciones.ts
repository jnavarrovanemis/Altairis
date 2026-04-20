"use server"

import { revalidatePath } from "next/cache"
import { apiRequest } from "@/lib/api-client"
import { 
  EstadoHabitacion, 
  HabitacionDTO, 
  HabitacionPayload, 
  ActionResponse 
} from "../types/api"

/**
 * Crea una nueva unidad física
 */
export async function createHabitacion(formData: FormData): Promise<ActionResponse> {
  const payload: HabitacionPayload = {
    numero: String(formData.get("numero")),
    tipoHabitacionId: Number(formData.get("tipoHabitacionId")),
    estado: (formData.get("estado") as EstadoHabitacion) || "Disponible",
  };

  try {
    // Asegúrate de que la ruta sea /api/habitaciones si apiRequest no pone el /api
    await apiRequest<HabitacionDTO>("/habitaciones", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    revalidatePath("/habitaciones");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message || "Error de red con el servidor" };
  }
}

/**
 * Actualiza la habitación completa (PUT)
 */
export async function updateHabitacion(id: number, formData: FormData): Promise<ActionResponse> {
  // 1. Ver el contenido crudo del FormData
  console.log("--- 📥 Datos recibidos (FormData) ---");
  const rawEntries = Object.fromEntries(formData.entries());
  console.log(rawEntries); 

  const payload = {
    id: id, 
    numero: String(formData.get("numero")),
    tipoHabitacionId: Number(formData.get("tipoHabitacionId")),
    estado: (formData.get("estado") as EstadoHabitacion),
  };

  try {
    await apiRequest<void>(`/habitaciones/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    
    revalidatePath("/habitaciones");
    return { success: true };
  } catch (e) {
    // 3. Ya tenías el error, pero vamos a hacerlo más detallado
    const error = e instanceof Error ? e : new Error("Error desconocido");
    
    return { success: false, error: error.message || "No se pudo actualizar" };
  }
}

/**
 * Actualiza solo el estado (PATCH)
 */
export async function updateEstadoHabitacion(id: number, nuevoEstado: EstadoHabitacion): Promise<ActionResponse> {
  try {
    await apiRequest<void>(`/habitaciones/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify(nuevoEstado), 
    });

    revalidatePath("/habitaciones");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message || "Error al cambiar estado" };
  }
}

/**
 * Elimina la habitación
 */
export async function deleteHabitacion(id: number): Promise<ActionResponse> {
  try {
    await apiRequest<void>(`/habitaciones/${id}`, { method: "DELETE" });
    revalidatePath("/habitaciones");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { success: false, error: error.message };
  }
}