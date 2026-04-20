export const ESTADOS_HABITACION = {
    Disponible: { label: "Disponible", color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    Ocupada: { label: "Ocupada", color: "bg-rose-500", light: "bg-rose-50 text-rose-700 border-rose-200" },
    Limpieza: { label: "En Limpieza", color: "bg-amber-500", light: "bg-amber-50 text-amber-700 border-amber-200" },
    Mantenimiento: { label: "Mantenimiento", color: "bg-slate-500", light: "bg-slate-50 text-slate-700 border-slate-200" },
  } as const;
  
  export type EstadoHabitacion = keyof typeof ESTADOS_HABITACION;