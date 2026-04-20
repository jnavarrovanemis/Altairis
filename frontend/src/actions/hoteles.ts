"use server"

import { apiRequest } from "@/lib/api-client";
import { revalidatePath } from "next/cache";
import { HotelDTO, HotelPayload, ActionResponse } from "../types/api";

export async function createHotel(formData: FormData): Promise<ActionResponse> {
  const payload: HotelPayload = {
    nombre: String(formData.get("nombre")),
    ciudad: String(formData.get("ciudad")),
    estrellas: Number(formData.get("estrellas")),
    activo: formData.get("activo") === "true",
  };

  try {
    await apiRequest<HotelDTO>("/hoteles", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { error: error.message || "Error al crear el hotel" };
  }
}

export async function updateHotel(id: number, formData: FormData): Promise<ActionResponse> {
  const payload: HotelPayload & { id: number } = {
    id: id,
    nombre: String(formData.get("nombre")),
    ciudad: String(formData.get("ciudad")),
    estrellas: Number(formData.get("estrellas")),
    activo: formData.get("activo") === "true",
  };

  try {
    await apiRequest<void>(`/hoteles/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { error: error.message ||  "No se pudo actualizar el hotel" };
  }
}

export async function deleteHotel(id: number): Promise<ActionResponse> {
  try {
    await apiRequest<void>(`/hoteles/${id}`, { method: "DELETE" });
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    const error = e as Error;
    return { error: error.message ||  "Error al eliminar el hotel" };
  }
}