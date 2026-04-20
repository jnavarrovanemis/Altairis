"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Hotel, 
  CalendarCheck,
  BedDouble, 
  Layers,
  Terminal,
  LogOut,
  LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * Interfaz estricta para las rutas del Sidebar
 * Garantiza que no usemos 'any' en los iconos de Lucide
 */
interface SidebarRoute {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

const routes: SidebarRoute[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-400",
  },
  {
    label: "Hoteles",
    icon: Hotel,
    href: "/hoteles",
    color: "text-violet-400",
  },
  {
    label: "Tipos de Habitación",
    icon: Layers,
    href: "/tipos-habitacion",
    color: "text-indigo-400",
  },
  {
    label: "Habitaciones",
    icon: BedDouble,
    href: "/habitaciones",
    color: "text-emerald-400",
  },
  {
    label: "Reservas",
    icon: CalendarCheck,
    href: "/reservas",
    color: "text-orange-400",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  /**
   * Simulación de Logout para entorno MVP
   */
  const handleLogoutClick = () => {
    toast.info("Entorno de Desarrollo", {
      description: "El perfil de José Alejandro es estático en este MVP. El cierre de sesión no es necesario ahora.",
      icon: <Terminal className="h-4 w-4 text-indigo-500" />,
      duration: 5000,
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 border-r border-white/5 shadow-2xl">
      <div className="px-4 py-6 flex-1">
        
        {/* --- BRANDING / LOGO --- */}
        <Link href="/" className="flex items-center pl-2 mb-10 group">
          <div className="relative w-10 h-10 mr-3">
            <div className="bg-indigo-600 w-full h-full rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              A
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-white leading-none uppercase">
              Altairis
            </h1>
            <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">
              Management System
            </span>
          </div>
        </Link>

        {/* --- NAVEGACIÓN --- */}
        <nav className="space-y-1.5">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-semibold cursor-pointer rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-white/10 text-white shadow-inner" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3 transition-colors", route.color)} />
                  {route.label}
                </div>
                {/* Indicador de estado activo */}
                {isActive && (
                  <div className="h-5 w-1 bg-indigo-500 rounded-full ml-2" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* --- FOOTER: PERFIL DEL INGENIERO --- */}
      <div className="px-4 border-t border-white/5 py-6 bg-black/20">
        <div className="flex items-center gap-x-3 px-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black border border-white/10 text-white shadow-lg">
              JA
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0f172a] rounded-full" />
          </div>
          
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">José Alejandro</p>
            <div className="flex items-center gap-1">
              <Terminal className="h-3 w-3 text-slate-500" />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider truncate">
                Systems Engineer
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={handleLogoutClick}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        
      </div>
    </div>
  );
}