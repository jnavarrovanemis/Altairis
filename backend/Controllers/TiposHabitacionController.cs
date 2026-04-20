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
    public class TiposHabitacionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TiposHabitacionController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<PagedResponse<TipoHabitacionDTO>>> GetTiposHabitacion(
            [FromQuery] int? hotelId,
            [FromQuery] string? nombre,
            [FromQuery] decimal? precioMin,
            [FromQuery] decimal? precioMax,
            [FromQuery] int? capacidad,
            [FromQuery] string? orden,
            [FromQuery] string direccion = "asc", // asc o desc
            [FromQuery] int pagina = 1,
            [FromQuery] int cantidad = 10)
        {
            var query = _context.TiposHabitacion.Include(th => th.Hotel).AsQueryable();

            // --- FILTROS ---
            if (hotelId.HasValue) query = query.Where(th => th.HotelId == hotelId.Value);
            if (!string.IsNullOrWhiteSpace(nombre)) query = query.Where(th => th.Nombre.Contains(nombre));
            if (precioMin.HasValue) query = query.Where(th => th.PrecioBase >= precioMin.Value);
            if (precioMax.HasValue) query = query.Where(th => th.PrecioBase <= precioMax.Value);
            if (capacidad.HasValue) query = query.Where(th => th.Capacidad == capacidad.Value);

            // --- ORDENAMIENTO (Lógica añadida) ---
            query = orden?.ToLower() switch
            {
                "nombre" => direccion == "desc" ? query.OrderByDescending(th => th.Nombre) : query.OrderBy(th => th.Nombre),
                "precio" => direccion == "desc" ? query.OrderByDescending(th => th.PrecioBase) : query.OrderBy(th => th.PrecioBase),
                "capacidad" => direccion == "desc" ? query.OrderByDescending(th => th.Capacidad) : query.OrderBy(th => th.Capacidad),
                _ => query.OrderBy(th => th.Id) // Orden por defecto
            };

            var totalRegistros = await query.CountAsync();
            
            var datos = await query
                .Skip((pagina - 1) * cantidad)
                .Take(cantidad)
                .Select(th => new TipoHabitacionDTO {
                    Id = th.Id,
                    HotelId = th.HotelId,
                    HotelNombre = th.Hotel != null ? th.Hotel.Nombre : "Sin Hotel",
                    Nombre = th.Nombre,
                    PrecioBase = th.PrecioBase,
                    Capacidad = th.Capacidad
                }).ToListAsync();

            return Ok(new PagedResponse<TipoHabitacionDTO>(datos, totalRegistros, pagina, cantidad));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TipoHabitacionDTO>> GetTipoHabitacion(int id)
        {
            var tipo = await _context.TiposHabitacion
                .Include(th => th.Hotel)
                .Where(th => th.Id == id)
                .Select(th => new TipoHabitacionDTO {
                    Id = th.Id, HotelId = th.HotelId, HotelNombre = th.Hotel.Nombre,
                    Nombre = th.Nombre, PrecioBase = th.PrecioBase, Capacidad = th.Capacidad
                }).FirstOrDefaultAsync();

            return tipo == null ? NotFound() : tipo;
        }

        [HttpPost]
        public async Task<ActionResult<TipoHabitacion>> PostTipoHabitacion([FromBody] TipoHabitacion tipo)
        {
            _context.TiposHabitacion.Add(tipo);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTipoHabitacion), new { id = tipo.Id }, tipo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoHabitacion(int id, [FromBody] TipoHabitacion tipo)
        {
            if (id != tipo.Id) return BadRequest();
            _context.Entry(tipo).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoHabitacion(int id)
        {
            var tipo = await _context.TiposHabitacion.FindAsync(id);
            if (tipo == null) return NotFound();
            _context.TiposHabitacion.Remove(tipo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}