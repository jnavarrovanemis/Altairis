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
    public class HotelesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HotelesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/hoteles
        [HttpGet]
        public async Task<ActionResult<PagedResponse<HotelDTO>>> GetHoteles(
            [FromQuery] string? ciudad,
            [FromQuery] int? estrellas,
            [FromQuery] bool? activo,
            [FromQuery] string? orden,
            [FromQuery] string? direccion,
            [FromQuery] int pagina = 1,
            [FromQuery] int cantidad = 10)
        {
            var query = _context.Hoteles.AsQueryable();

            if (!string.IsNullOrWhiteSpace(ciudad)) query = query.Where(h => h.Ciudad.Contains(ciudad));
            if (estrellas.HasValue) query = query.Where(h => h.Estrellas == estrellas.Value);
            if (activo.HasValue) query = query.Where(h => h.Activo == activo.Value);

            if (!string.IsNullOrWhiteSpace(orden))
            {
                bool esDescendente = direccion?.ToLower() == "desc";
                switch (orden.ToLower())
                {
                    case "ciudad": query = esDescendente ? query.OrderByDescending(h => h.Ciudad) : query.OrderBy(h => h.Ciudad); break;
                    case "estrellas": query = esDescendente ? query.OrderByDescending(h => h.Estrellas) : query.OrderBy(h => h.Estrellas); break;
                    case "activo": query = esDescendente ? query.OrderByDescending(h => h.Activo) : query.OrderBy(h => h.Activo); break;
                    case "id": query = esDescendente ? query.OrderByDescending(h => h.Id) : query.OrderBy(h => h.Id); break;
                    default: query = esDescendente ? query.OrderByDescending(h => h.Nombre) : query.OrderBy(h => h.Nombre); break;
                }
            }

            var totalRegistros = await query.CountAsync();
            
            var datosPaginados = await query
                .Skip((pagina - 1) * cantidad)
                .Take(cantidad)
                .Select(h => new HotelDTO 
                {
                    Id = h.Id,
                    Nombre = h.Nombre,
                    Ciudad = h.Ciudad,
                    Estrellas = h.Estrellas,
                    Activo = h.Activo
                })
                .ToListAsync();

            return Ok(new PagedResponse<HotelDTO>(datosPaginados, totalRegistros, pagina, cantidad));
        }

        // GET: api/hoteles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HotelDTO>> GetHotel(int id)
        {
            var hotel = await _context.Hoteles
                .Where(h => h.Id == id)
                .Select(h => new HotelDTO
                {
                    Id = h.Id,
                    Nombre = h.Nombre,
                    Ciudad = h.Ciudad,
                    Estrellas = h.Estrellas,
                    Activo = h.Activo
                })
                .FirstOrDefaultAsync();

            if (hotel == null) return NotFound();
            return hotel;
        }

        // POST: api/hoteles
        [HttpPost]
        public async Task<ActionResult<Hotel>> PostHotel(Hotel hotel)
        {
            _context.Hoteles.Add(hotel);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetHotel), new { id = hotel.Id }, hotel);
        }

        // PUT: api/hoteles/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHotel(int id, Hotel hotel)
        {
            if (id != hotel.Id) return BadRequest("El ID no coincide.");
            _context.Entry(hotel).State = EntityState.Modified;

            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Hoteles.Any(e => e.Id == id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        // DELETE: api/hoteles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            var hotel = await _context.Hoteles.FindAsync(id);
            if (hotel == null) return NotFound();

            _context.Hoteles.Remove(hotel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}