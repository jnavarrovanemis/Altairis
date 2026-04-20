import { getReservas } from "@/services/reservaServices";
import { ReservasDataTable } from "@/components/reservas/ReservasDataTable";
import { CreateReservaModal } from "@/components/reservas/CreateReservaModal";
import { FiltrosReserva, EstadoReserva } from "@/types/api";
import { CalendarDays, LayoutList } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReservasPage({ searchParams }: PageProps) {
  const sParams = await searchParams;

  const filtros: FiltrosReserva = {
    pagina: Number(sParams.pagina) || 1,
    cantidad: Number(sParams.cantidad) || 10,
    huesped: sParams.huesped as string,
    estado: sParams.estado as EstadoReserva,
    desde: sParams.desde as string,
    hasta: sParams.hasta as string,
    orden: (sParams.orden as string) || "fechaEntrada",
    direccion: (sParams.direccion as "asc" | "desc") || "desc",
  };

  const response = await getReservas(filtros);

  return (
    <div className="p-8 space-y-6 bg-slate-50/40 min-h-screen">
      
      {/* HEADER DE MÓDULO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-100">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
              Control de Reservas
            </h1>
          </div>
          <p className="text-slate-500 font-medium flex items-center gap-2 pl-1">
            <LayoutList className="h-4 w-4 text-indigo-500" />
            Gestión de ingresos, salidas y disponibilidad operativa.
          </p>
        </div>
        
        <CreateReservaModal />
      </div>

      {/* TABLA DE DATOS */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <ReservasDataTable 
          data={response.datos} 
          paginaActual={response.paginaActual}
          totalPaginas={response.totalPaginas}
          totalRegistros={response.totalRegistros}
        />
      </div>
    </div>
  );
}