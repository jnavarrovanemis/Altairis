import { apiRequest } from '@/lib/api-client';
import { HabitacionDTO, PagedResponse, FiltrosHabitacion } from '../types/api';

export async function getHabitaciones(params: FiltrosHabitacion = {}): Promise<PagedResponse<HabitacionDTO>> {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value.toString());
    }
  });

  console.log(`/habitaciones?${query.toString()}`);

  return apiRequest<PagedResponse<HabitacionDTO>>(`/habitaciones?${query.toString()}`, { 
    cache: 'no-store' 
  });
}