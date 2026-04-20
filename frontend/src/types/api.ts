/**
 * ESTADOS (ENUMS)
 * Deben coincidir exactamente con los Enums de C#
 */
export enum EstadoHabitacion {
  Disponible = "Disponible",
  Ocupada = "Ocupada",
  Reservada = "Reservada",
  Mantenimiento = "Mantenimiento",
  Limpieza = "Limpieza"
}

export enum EstadoReserva {
  Pendiente = "Pendiente",
  Confirmada = "Confirmada",
  CheckIn = "CheckIn",
  CheckOut = "CheckOut",
  Cancelada = "Cancelada"
}

/**
 * ESTRUCTURAS DE RESPUESTA (GENÉRICOS)
 */
export interface PagedResponse<T> {
  totalRegistros: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
  datos: T[];
}

export interface ActionResponse {
  success?: boolean;
  error?: string;
}

/**
 * MÓDULO: HOTELES
 */
export interface HotelDTO {
  id: number;
  nombre: string;
  ciudad: string;
  estrellas: number;
  activo: boolean;
}

export interface HotelPayload {
  nombre: string;
  ciudad: string;
  estrellas: number;
  activo: boolean;
}

/**
 * MÓDULO: TIPOS DE HABITACIÓN (CATEGORÍAS)
 */
export interface TipoHabitacionDTO {
  id: number;
  hotelId: number;
  hotelNombre: string;
  nombre: string;
  precioBase: number;
  capacidad: number;
}

export interface TipoHabitacionPayload {
  hotelId: number;
  nombre: string;
  precioBase: number;
  capacidad: number;
}

/**
 * MÓDULO: HABITACIONES (UNIDADES FÍSICAS)
 */
export interface HabitacionDTO {
  id: number;
  numero: string;
  estado: EstadoHabitacion;
  tipoHabitacionId: number;
  // Datos aplanados del JOIN
  tipoNombre: string;
  precioBase: number;
  capacidad: number;
  hotelNombre: string;
}

export interface HabitacionPayload {
  numero: string;
  tipoHabitacionId: number;
  estado: EstadoHabitacion;
}

/**
 * MÓDULO: RESERVAS
 */
export interface ReservaDTO {
  id: number;
  nombreHuesped: string;
  fechaEntrada: string; // ISO 8601
  fechaSalida: string;
  estado: EstadoReserva;
  habitacionId: number;
  // Datos aplanados del JOIN
  numeroHabitacion: string;
  tipoHabitacionNombre: string;
  hotelNombre: string;
  precioPorNoche: number;
}

export interface ReservaPayload {
  habitacionId: number;
  nombreHuesped: string;
  fechaEntrada: string;
  fechaSalida: string;
  estado: EstadoReserva;
}

/**
 * PARÁMETROS DE FILTRADO (QUERY PARAMS)
 */
export interface FiltrosBase {
  pagina?: number;
  cantidad?: number;
  orden?: string;
  direccion?: 'asc' | 'desc';
}

export interface FiltrosHotel extends FiltrosBase {
  ciudad?: string;
  estrellas?: number;
  activo?: boolean;
}

export interface FiltrosTipoHabitacion extends FiltrosBase {
  nombre?: string;
  capacidad?: number;
  hotelId?: number;
  precioMin?: number;
  precioMax?: number;
}

export interface FiltrosHabitacion {
  pagina?: number;
  cantidad?: number;
  orden?: string;
  direccion?: "asc" | "desc";
  // --- AÑADE ESTO ---
  numero?: string; 
  estado?: EstadoHabitacion; // O string, según lo tengas
  hotelId?: number;
  tipoHabitacionId?: number;
}

export interface FiltrosReserva extends FiltrosBase {
  hotelId?: number;
  estado?: EstadoReserva;
  huesped?: string;
  desde?: string;
  hasta?: string;
}