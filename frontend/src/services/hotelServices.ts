import { apiRequest } from '@/lib/api-client';
import { HotelDTO, PagedResponse } from '../types/api';

interface HotelParams {
  pagina?: number;
  cantidad?: number;
  orden?: string;
  direccion?: 'asc' | 'desc';
  ciudad?: string;
  estrellas?: number;
  activo?: boolean;
}

export async function getHoteles(params: HotelParams = {}): Promise<PagedResponse<HotelDTO>> {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, value.toString());
    }
  });

  return apiRequest<PagedResponse<HotelDTO>>(`/hoteles?${query.toString()}`, { 
    cache: 'no-store' 
  });
}