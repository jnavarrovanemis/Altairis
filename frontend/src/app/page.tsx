import { getHoteles } from "@/services/hotelServices";
import { getHabitaciones } from "@/services/habitacionServices";
import { getReservas } from "@/services/reservaServices";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default async function HomePage() {
  /**
   * Disparamos las 3 peticiones en paralelo para optimizar 
   * el tiempo de carga del servidor.
   */
  const [resHoteles, resHabitaciones, resReservas] = await Promise.all([
    getHoteles({ cantidad: 100 }),      // Ajusta la cantidad según necesites
    getHabitaciones({ cantidad: 100 }), 
    getReservas({ cantidad: 100 })
  ]);

  return (
    <DashboardView 
      data={resHoteles.datos} 
      totalRegistros={resHoteles.totalRegistros} 
      habitaciones={resHabitaciones.datos} 
      reservas={resReservas.datos}      
    />
  );
}