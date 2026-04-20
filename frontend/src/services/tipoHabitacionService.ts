import { apiRequest } from '@/lib/api-client';
import { TipoHabitacionDTO, PagedResponse, FiltrosTipoHabitacion } from '../types/api';

/**
 * Usamos FiltrosTipoHabitacion para garantizar que capacidad, 
 * orden y direccion sean enviados a la API.
 */
export async function getTiposHabitacion(params: FiltrosTipoHabitacion = {}): Promise<PagedResponse<TipoHabitacionDTO>> {
  const query = new URLSearchParams();
  
  // Mapeo dinámico: Limpiamos undefined y null antes de enviar
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value.toString());
    }
  });

  // Esto te servirá para debuguear en la consola del servidor (Docker logs)
  console.log(`[API Call]: /tiposhabitacion?${query.toString()}`);

  return apiRequest<PagedResponse<TipoHabitacionDTO>>(`/tiposhabitacion?${query.toString()}`, { 
    cache: 'no-store' 
  });
}