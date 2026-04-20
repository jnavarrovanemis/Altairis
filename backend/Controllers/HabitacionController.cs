using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ViajesAltairis.Api.Data;
using ViajesAltairis.Api.Models;
using ViajesAltairis.Api.Models.DTOs;
using ViajesAltairis.Api.Models.Responses;

namespace ViajesAltairis.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitacionesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HabitacionesController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<PagedResponse<HabitacionDTO>>> GetHabitaciones(
            [FromQuery] int? hotelId,
            [FromQuery] int? tipoId,
            [FromQuery] string? numero,
            [FromQuery] EstadoHabitacion? estado,
            [FromQuery] string? orden,
            [FromQuery] string direccion = "asc",
            [FromQuery] int pagina = 1,
            [FromQuery] int cantidad = 10)
        {
            var query = _context.Habitaciones
                .Include(h => h.TipoHabitacion)
                .ThenInclude(th => th.Hotel)
                .AsQueryable();

            // --- FILTROS ---
            if (hotelId.HasValue) query = query.Where(h => h.TipoHabitacion.HotelId == hotelId.Value);
            if (tipoId.HasValue) query = query.Where(h => h.TipoHabitacionId == tipoId.Value);
            if (estado.HasValue) query = query.Where(h => h.Estado == estado.Value);
            
            // Nuevo filtro por número de habitación
            if (!string.IsNullOrWhiteSpace(numero)) 
                query = query.Where(h => h.Numero.Contains(numero));

            // --- ORDENAMIENTO (Lógica añadida) ---
            query = orden?.ToLower() switch
            {
                "numero" => direccion == "desc" 
                    ? query.OrderByDescending(h => h.Numero) 
                    : query.OrderBy(h => h.Numero),
                "hotel" => direccion == "desc" 
                    ? query.OrderByDescending(h => h.TipoHabitacion.Hotel.Nombre) 
                    : query.OrderBy(h => h.TipoHabitacion.Hotel.Nombre),
                "tipo" => direccion == "desc" 
                    ? query.OrderByDescending(h => h.TipoHabitacion.Nombre) 
                    : query.OrderBy(h => h.TipoHabitacion.Nombre),
                _ => query.OrderBy(h => h.Numero) // Orden por defecto: Número de habitación
            };

            var totalRegistros = await query.CountAsync();
            
            var datos = await query
                .Skip((pagina - 1) * cantidad)
                .Take(cantidad)
                .Select(h => new HabitacionDTO {
                    Id = h.Id,
                    Numero = h.Numero,
                    Estado = h.Estado.ToString(),
                    TipoHabitacionId = h.TipoHabitacionId,
                    TipoNombre = h.TipoHabitacion.Nombre,
                    PrecioBase = h.TipoHabitacion.PrecioBase,
                    Capacidad = h.TipoHabitacion.Capacidad,
                    HotelNombre = h.TipoHabitacion.Hotel.Nombre
                }).ToListAsync();

            return Ok(new PagedResponse<HabitacionDTO>(datos, totalRegistros, pagina, cantidad));
        }

        [HttpPost]
        public async Task<ActionResult<Habitacion>> PostHabitacion([FromBody] Habitacion habitacion)
        {
            var tipoExiste = await _context.TiposHabitacion.AnyAsync(t => t.Id == habitacion.TipoHabitacionId);
            if (!tipoExiste) return BadRequest("El Tipo de Habitación no existe.");

            _context.Habitaciones.Add(habitacion);
            await _context.SaveChangesAsync();
            return Ok(habitacion);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutHabitacion(int id, [FromBody] Habitacion habitacion)
        {
            if (id != habitacion.Id) return BadRequest();
            _context.Entry(habitacion).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}/estado")]
        public async Task<IActionResult> UpdateEstado(int id, [FromBody] EstadoHabitacion nuevoEstado)
        {
            var habitacion = await _context.Habitaciones.FindAsync(id);
            if (habitacion == null) return NotFound();

            habitacion.Estado = nuevoEstado;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHabitacion(int id)
        {
            var habitacion = await _context.Habitaciones.FindAsync(id);
            if (habitacion == null) return NotFound();
            _context.Habitaciones.Remove(habitacion);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}