import { getTiposHabitacion } from "@/services/tipoHabitacionService";
import { TiposHabitacionDataTable } from "@/components/tipoHabitaciones/TiposHabitacionDataTable";
import { CreateTipoHabitacionModal } from "@/components/tipoHabitaciones/CreateTipoHabitacionModal";
import { FiltrosTipoHabitacion } from "@/types/api";

interface PageProps {
  /**
   * En Next.js 15, searchParams es una Promise que debe ser resuelta antes de usarse.
   */
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TiposHabitacionPage({ searchParams }: PageProps) {
  // 1. Resolvemos los parámetros de búsqueda de la URL (Asíncrono en Next.js 15)
  const sParams = await searchParams;

  // 2. Construcción del objeto de filtros con tipado estricto (Zero-Any)
  // Convertimos los valores de string de la URL a los tipos requeridos por la API de .NET
  const filtros: FiltrosTipoHabitacion = {
    pagina: Number(sParams.pagina) || 1,
    cantidad: Number(sParams.cantidad) || 10,
    orden: (sParams.orden as string) || "nombre",
    direccion: (sParams.direccion as "asc" | "desc") || "asc",
    nombre: (sParams.nombre as string) || undefined,
    // Conversiones numéricas explícitas para evitar fallos en el Backend
    capacidad: sParams.capacidad ? Number(sParams.capacidad) : undefined,
    hotelId: sParams.hotelId ? Number(sParams.hotelId) : undefined,
    precioMin: sParams.precioMin ? Number(sParams.precioMin) : undefined,
    precioMax: sParams.precioMax ? Number(sParams.precioMax) : undefined,
  };

  // 3. Llamada al servicio centralizado
  // La respuesta cumple con la interfaz PagedResponse<TipoHabitacionDTO>
  const response = await getTiposHabitacion(filtros);

  return (
    <div className="p-8 space-y-6 bg-slate-50/40 min-h-screen">
      
      {/* CABECERA DE PÁGINA: Título, Descripción y Acción Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Catálogo de Habitaciones
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestiona las categorías, capacidades y precios base de la red Altairis.
          </p>
        </div>
        
        {/* Modal para registro de nuevas categorías (Tipos de Habitación) */}
        <CreateTipoHabitacionModal />
      </div>

      {/* SECCIÓN DE DATOS: Tabla con filtros, ordenamiento y paginación */}
      <div className="w-full">
        <TiposHabitacionDataTable 
          data={response.datos} 
          paginaActual={response.paginaActual}
          totalPaginas={response.totalPaginas}
          totalRegistros={response.totalRegistros}
        />
      </div>
    </div>
  );
}