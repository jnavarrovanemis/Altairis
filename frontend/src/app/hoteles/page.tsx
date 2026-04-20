import { getHoteles } from "@/services/hotelServices"; // Asegúrate de que el nombre del archivo sea correcto
import { HotelDataTable } from "@/components/hoteles/HotelDataTable";
import { CreateHotelModal } from "@/components/hoteles/CreateHotelModal";
import { FiltrosHotel } from "@/types/api";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HotelesPage({ searchParams }: PageProps) {
  // 1. Resolvemos la promesa de searchParams (Requerido en Next.js 15)
  const sParams = await searchParams;

  // 2. Construimos el objeto de filtros tipado
  // Convertimos los strings de la URL a los tipos que espera FiltrosHotel (number, boolean, etc.)
  const filtros: FiltrosHotel = {
    pagina: Number(sParams.pagina) || 1,
    cantidad: Number(sParams.cantidad) || 10,
    orden: (sParams.orden as string) || "nombre",
    direccion: (sParams.direccion as "asc" | "desc") || "asc",
    ciudad: (sParams.ciudad as string) || undefined,
    estrellas: sParams.estrellas ? Number(sParams.estrellas) : undefined,
    // Mapeo lógico para el booleano 'activo'
    activo: sParams.activo === "true" ? true : sParams.activo === "false" ? false : undefined,
  };

  // 3. Llamada al servicio usando el objeto de filtros
  // Gracias al Zero-Any, response ya viene tipado como PagedResponse<HotelDTO>
  const response = await getHoteles(filtros);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Gestión de Hoteles
          </h1>
          <p className="text-muted-foreground text-sm">
            Administra las sedes, categorías y disponibilidad de la cadena Altairis.
          </p>
        </div>
        <CreateHotelModal />
      </div>

      {/* Pasamos los datos a la tabla. 
          Al estar tipado, HotelDataTable sabrá exactamente qué propiedades tiene cada hotel.
      */}
      <HotelDataTable 
        data={response.datos} 
        paginaActual={response.paginaActual}
        totalPaginas={response.totalPaginas}
        totalRegistros={response.totalRegistros}
      />
    </div>
  );
}