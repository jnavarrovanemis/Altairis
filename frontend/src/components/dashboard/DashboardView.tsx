"use client"

import { HotelStats } from "@/components/dashboard/HotelStats";
import { HabitacionStats } from "@/components/dashboard/HabitacionStats";
import { ReservaStats } from "@/components/dashboard/ReservaStats";
import { HotelDTO, HabitacionDTO, ReservaDTO } from "@/types/api";
import { 
  Building2, 
  Activity, 
  CheckCircle2, 
  RefreshCcw, 
  ArrowUpRight,
  BedDouble,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardViewProps {
  data: HotelDTO[];
  totalRegistros: number;
  habitaciones: HabitacionDTO[]; // Nuevas props necesarias
  reservas: ReservaDTO[];        // Nuevas props necesarias
}

export function DashboardView({ data, totalRegistros, habitaciones, reservas }: DashboardViewProps) {
  const hotelesActivos = data.filter(h => h.activo).length;
  const porcentajeActivos = (hotelesActivos / totalRegistros) * 100;

  return (
    <div className="p-8 space-y-10 bg-slate-50/40 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Control Center
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestión de Activos Altairis • <span className="text-slate-400 font-normal italic">v1.2.0-Production</span>
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-fit shadow-sm bg-white border-slate-200 text-slate-600 hover:bg-slate-50 transition-all hover:border-indigo-300">
          <RefreshCcw className="mr-2 h-4 w-4" /> Sincronizar Datos
        </Button>
      </div>

      {/* --- FILA 1: KPIs SUPERIORES --- */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* KPI: Sedes Totales */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><Building2 className="h-5 w-5" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sedes</span>
          </div>
          <p className="text-4xl font-black text-slate-800 tracking-tighter">{totalRegistros}</p>
          <p className="text-xs text-slate-400 mt-1 font-bold italic">Hoteles registrados</p>
        </div>

        {/* KPI: Habitaciones Totales */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><BedDouble className="h-5 w-5" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacidad</span>
          </div>
          <p className="text-4xl font-black text-slate-800 tracking-tighter">{habitaciones.length}</p>
          <p className="text-xs text-slate-400 mt-1 font-bold italic">Unidades físicas</p>
        </div>

        {/* KPI: Reservas Activas */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><CalendarDays className="h-5 w-5" /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad</span>
          </div>
          <p className="text-4xl font-black text-slate-800 tracking-tighter">{reservas.length}</p>
          <p className="text-xs text-slate-400 mt-1 font-bold italic">Check-ins registrados</p>
        </div>

        {/* KPI: Health (Estilo Dark) */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
             <Activity className="h-5 w-5 text-green-400 animate-pulse" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">API Status</span>
          </div>
          <p className="text-xl font-bold flex items-center gap-2">Online <ArrowUpRight className="h-4 w-4 text-green-400" /></p>
          <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-tighter">Latencia: 42ms</p>
        </div>
      </div>

      {/* --- FILA 2: ANÁLISIS DE INFRAESTRUCTURA E INVENTARIO --- */}
      <div className="grid gap-8 md:grid-cols-7">
        {/* Infraestructura (Bar Chart) */}
        <div className="md:col-span-4 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm p-4">
           <HotelStats hoteles={data} />
        </div>

        {/* Inventario (Pie Chart) */}
        <div className="md:col-span-3 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm p-4">
           <HabitacionStats habitaciones={habitaciones} />
        </div>
      </div>

      {/* --- FILA 3: VOLUMEN DE RESERVAS Y TASA OPERATIVA --- */}
      <div className="grid gap-8 md:grid-cols-7">
        {/* Volumen de Reservas (Line Chart) */}
        <div className="md:col-span-5 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm p-4">
           <ReservaStats reservas={reservas} />
        </div>

        {/* Tasa Operativa (Hoteles Activos) */}
        <div className="md:col-span-2 group relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-md flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tasa Operativa</h3>
            <div className="rounded-xl bg-green-50 p-2 text-green-600"><CheckCircle2 className="h-5 w-5" /></div>
          </div>
          <div className="mt-6">
            <span className="text-6xl font-black text-green-600 tracking-tighter">
              {porcentajeActivos.toFixed(0)}%
            </span>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Sedes operando actualmente
            </p>
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                <span>Estado de Red</span>
                <span>{hotelesActivos} / {totalRegistros}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out" 
                  style={{ width: `${porcentajeActivos}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}