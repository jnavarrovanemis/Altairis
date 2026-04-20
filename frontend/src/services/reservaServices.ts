import { apiRequest } from '@/lib/api-client';
import { ReservaDTO, PagedResponse, FiltrosReserva } from '../types/api';

/**
 * Obtiene el listado de reservas paginado y filtrado.
 * Implementa la misma lógica de construcción de query que el módulo de habitaciones.
 */
export async function getReservas(params: FiltrosReserva = {}): Promise<PagedResponse<ReservaDTO>> {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value.toString());
    }
  });

  // Log de depuración para desarrollo en el Homelab
  console.log(`GET /reservas?${query.toString()}`);

  return apiRequest<PagedResponse<ReservaDTO>>(`/reservas?${query.toString()}`, { 
    cache: 'no-store' 
  });
}