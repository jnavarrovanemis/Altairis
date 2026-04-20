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
    public class ReservasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReservasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/reservas
        [HttpGet]
        public async Task<ActionResult<PagedResponse<ReservaDTO>>> GetReservas(
            [FromQuery] int? hotelId,
            [FromQuery] int? habitacionId,
            [FromQuery] DateTime? desde,
            [FromQuery] DateTime? hasta,
            [FromQuery] EstadoReserva? estado,
            [FromQuery] string? huesped,
            [FromQuery] string? orden,
            [FromQuery] string? direccion,
            [FromQuery] int pagina = 1,
            [FromQuery] int cantidad = 10)
        {
            var query = _context.Reservas
                .Include(r => r.Habitacion)
                    .ThenInclude(h => h.TipoHabitacion)
                        .ThenInclude(th => th.Hotel)
                .AsQueryable();

            // Filtros
            if (hotelId.HasValue) query = query.Where(r => r.Habitacion.TipoHabitacion.HotelId == hotelId.Value);
            if (habitacionId.HasValue) query = query.Where(r => r.HabitacionId == habitacionId.Value);
            if (desde.HasValue) query = query.Where(r => r.FechaEntrada >= desde.Value);
            if (hasta.HasValue) query = query.Where(r => r.FechaEntrada <= hasta.Value);
            if (estado.HasValue) query = query.Where(r => r.Estado == estado.Value);
            if (!string.IsNullOrWhiteSpace(huesped)) query = query.Where(r => r.NombreHuesped.Contains(huesped));

            // Ordenamiento
            if (!string.IsNullOrWhiteSpace(orden))
            {
                bool esDescendente = direccion?.ToLower() == "desc";
                switch (orden.ToLower())
                {
                    case "entrada": query = esDescendente ? query.OrderByDescending(r => r.FechaEntrada) : query.OrderBy(r => r.FechaEntrada); break;
                    case "huesped": query = esDescendente ? query.OrderByDescending(r => r.NombreHuesped) : query.OrderBy(r => r.NombreHuesped); break;
                    case "estado": query = esDescendente ? query.OrderByDescending(r => r.Estado) : query.OrderBy(r => r.Estado); break;
                    default: query = esDescendente ? query.OrderByDescending(r => r.Id) : query.OrderBy(r => r.Id); break;
                }
            }

            var totalRegistros = await query.CountAsync();
            
            var datosPaginados = await query
                .Skip((pagina - 1) * cantidad)
                .Take(cantidad)
                .Select(r => new ReservaDTO 
                {
                    Id = r.Id,
                    HabitacionId = r.HabitacionId, // <--- AÑADIDO PARA EL FRONTEND
                    NombreHuesped = r.NombreHuesped,
                    FechaEntrada = r.FechaEntrada,
                    FechaSalida = r.FechaSalida,
                    Estado = r.Estado.ToString(),
                    NumeroHabitacion = r.Habitacion.Numero,
                    TipoHabitacionNombre = r.Habitacion.TipoHabitacion.Nombre,
                    HotelNombre = r.Habitacion.TipoHabitacion.Hotel.Nombre,
                    PrecioPorNoche = r.Habitacion.TipoHabitacion.PrecioBase
                })
                .ToListAsync();

            return Ok(new PagedResponse<ReservaDTO>(datosPaginados, totalRegistros, pagina, cantidad));
        }

        // GET: api/reservas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReservaDTO>> GetReserva(int id)
        {
            var reserva = await _context.Reservas
                .Include(r => r.Habitacion)
                    .ThenInclude(h => h.TipoHabitacion)
                        .ThenInclude(th => th.Hotel)
                .Where(r => r.Id == id)
                .Select(r => new ReservaDTO
                {
                    Id = r.Id,
                    HabitacionId = r.HabitacionId, // <--- AÑADIDO PARA EL FRONTEND
                    NombreHuesped = r.NombreHuesped,
                    FechaEntrada = r.FechaEntrada,
                    FechaSalida = r.FechaSalida,
                    Estado = r.Estado.ToString(),
                    NumeroHabitacion = r.Habitacion.Numero,
                    TipoHabitacionNombre = r.Habitacion.TipoHabitacion.Nombre,
                    HotelNombre = r.Habitacion.TipoHabitacion.Hotel.Nombre,
                    PrecioPorNoche = r.Habitacion.TipoHabitacion.PrecioBase
                })
                .FirstOrDefaultAsync();

            if (reserva == null) return NotFound();
            return reserva;
        }

        // POST: api/reservas
        [HttpPost]
        public async Task<ActionResult<Reserva>> PostReserva([FromBody] Reserva reserva)
        {
            if (reserva.FechaEntrada >= reserva.FechaSalida)
                return BadRequest(new { message = "La fecha de salida debe ser posterior a la de entrada." });

            var habitacion = await _context.Habitaciones.FindAsync(reserva.HabitacionId);
            if (habitacion == null) return BadRequest(new { message = "La habitación seleccionada no existe." });

            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReserva), new { id = reserva.Id }, reserva);
        }

        // PUT: api/reservas/5 <--- ¡NUEVO MÉTODO REQUERIDO PARA EL EDIT!
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReserva(int id, [FromBody] Reserva reserva)
        {
            if (id != reserva.Id)
                return BadRequest(new { message = "El ID de la URL no coincide con la reserva." });

            if (reserva.FechaEntrada >= reserva.FechaSalida)
                return BadRequest(new { message = "La fecha de salida debe ser posterior a la de entrada." });

            var habitacionExists = await _context.Habitaciones.AnyAsync(h => h.Id == reserva.HabitacionId);
            if (!habitacionExists)
                return BadRequest(new { message = "La habitación asignada no existe." });

            _context.Entry(reserva).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Reservas.Any(e => e.Id == id))
                    return NotFound(new { message = "La reserva no existe." });
                else
                    throw;
            }

            return NoContent();
        }

        // PATCH: api/reservas/5/estado
        [HttpPatch("{id}/estado")]
        public async Task<IActionResult> UpdateEstado(int id, [FromBody] EstadoReserva nuevoEstado)
        {
            var reserva = await _context.Reservas.Include(r => r.Habitacion).FirstOrDefaultAsync(r => r.Id == id);
            if (reserva == null) return NotFound();

            reserva.Estado = nuevoEstado;

            // Lógica de negocio automática
            if (nuevoEstado == EstadoReserva.CheckIn)
            {
                reserva.Habitacion.Estado = EstadoHabitacion.Ocupada;
            }
            else if (nuevoEstado == EstadoReserva.CheckOut)
            {
                reserva.Habitacion.Estado = EstadoHabitacion.Limpieza;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/reservas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReserva(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null) return NotFound();

            _context.Reservas.Remove(reserva);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}