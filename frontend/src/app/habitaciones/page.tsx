import { getHabitaciones } from "@/services/habitacionServices";
import { HabitacionesDataTable } from "@/components/habitaciones/HabitacionesDataTable";
import { CreateHabitacionModal } from "@/components/habitaciones/CreateHabitacionModal";
import { FiltrosHabitacion, EstadoHabitacion } from "@/types/api";
import { BedDouble, LayoutList } from "lucide-react";

interface PageProps {
  /**
   * Next.js 15: searchParams es una Promise que debe ser resuelta.
   */
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HabitacionesPage({ searchParams }: PageProps) {
  // 1. Resolvemos los parámetros de la URL
  const sParams = await searchParams;

  // 2. Construcción de filtros con casting seguro para TypeScript
  const filtros: FiltrosHabitacion = {
    pagina: Number(sParams.pagina) || 1,
    cantidad: Number(sParams.cantidad) || 10,
    orden: (sParams.orden as string) || "numero",
    direccion: (sParams.direccion as "asc" | "desc") || "asc",
    
    // Casting de los filtros específicos
    numero: sParams.numero ? (sParams.numero as string) : undefined,
    estado: sParams.estado ? (sParams.estado as EstadoHabitacion) : undefined,
    
    // Si necesitas filtrar por hotel o tipo desde la URL:
    hotelId: sParams.hotelId ? Number(sParams.hotelId) : undefined,
    tipoHabitacionId: sParams.tipoId ? Number(sParams.tipoId) : undefined,
  };

  /**
   * 3. Consumo del servicio de Altairis (Backend .NET)
   */
  const response = await getHabitaciones(filtros);

  return (
    <div className="p-8 space-y-6 bg-slate-50/40 min-h-screen">
      
      {/* CABECERA DE PÁGINA: Estética Enterprise */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-100">
              <BedDouble className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
              Inventario de Habitaciones
            </h1>
          </div>
          <p className="text-slate-500 font-medium flex items-center gap-2 pl-1">
            <LayoutList className="h-4 w-4 text-indigo-500" />
            Control de unidades físicas, estados de limpieza y disponibilidad.
          </p>
        </div>
        
        {/* MODAL DE CREACIÓN: El disparador del flujo operativo */}
        <div className="w-full md:w-auto pt-2 md:pt-0">
          <CreateHabitacionModal />
        </div>
      </div>

      {/* TABLA DE DATOS: HabitacionesDataTable */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <HabitacionesDataTable 
          data={response.datos} 
          paginaActual={response.paginaActual}
          totalPaginas={response.totalPaginas}
          totalRegistros={response.totalRegistros}
        />
      </div>
      
    </div>
  );
}