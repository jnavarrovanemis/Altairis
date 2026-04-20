"use server"

import { revalidatePath } from "next/cache"
import { apiRequest } from "@/lib/api-client"
import { TipoHabitacionPayload, ActionResponse } from "../types/api"

/**
 * Crea una nueva categoría de habitación vinculada a un hotel.
 */
export async function createTipoHabitacion(formData: FormData): Promise<ActionResponse> {
    try {
      // 1. Extraemos y parseamos los datos del FormData
      const rawData = {
        nombre: formData.get("nombre") as string,
        hotelId: Number(formData.get("hotelId")),
        precioBase: Number(formData.get("precioBase")),
        capacidad: Number(formData.get("capacidad")),
      };
  
      // 2. Enviamos al Backend (.NET)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tiposhabitacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rawData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || "Error al crear en el servidor" };
      }
  
      // 3. Limpiamos la caché de Next.js para ver el nuevo registro al instante
      revalidatePath("/tipos-habitacion");
      return { success: true };
  
    } catch (error) {
        const e = error as Error;
        return { error: e.message || "Error al crear la categoría" };
    }
  }

/**
 * Actualiza una categoría existente.
 * Combinamos el Payload con el ID para cumplir con la validación del backend.
 */
export async function updateTipoHabitacion(id: number, formData: FormData): Promise<ActionResponse> {
  const payload: TipoHabitacionPayload & { id: number } = {
    id: id,
    hotelId: Number(formData.get("hotelId")),
    nombre: String(formData.get("nombre")),
    precioBase: Number(formData.get("precioBase")),
    capacidad: Number(formData.get("capacidad")),
  };

  try {
    await apiRequest<void>(`/tiposhabitacion/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    revalidatePath("/tipos-habitacion");
    // También revalidamos habitaciones y reservas porque el nombre o precio pudo cambiar
    // y esos datos están "aplanados" en sus respectivos DTOs.
    revalidatePath("/habitaciones");
    revalidatePath("/reservas");
    
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { error: error.message || "No se pudo actualizar la categoría" };
  }
}

/**
 * Elimina una categoría.
 */
export async function deleteTipoHabitacion(id: number): Promise<ActionResponse> {
  try {
    await apiRequest<void>(`/tiposhabitacion/${id}`, { method: "DELETE" });
    revalidatePath("/tipos-habitacion");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { error: error.message || "No se pudo eliminar la categoría" };
  }
}