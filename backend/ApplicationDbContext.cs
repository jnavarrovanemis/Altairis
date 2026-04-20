using Microsoft.EntityFrameworkCore;
using ViajesAltairis.Api.Models;

namespace ViajesAltairis.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // Estas serán tus tablas en SQL Server
    public DbSet<Hotel> Hoteles { get; set; }
    public DbSet<TipoHabitacion> TiposHabitacion { get; set; }
    public DbSet<Habitacion> Habitaciones { get; set; }
    public DbSet<Reserva> Reservas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Aquí podrías configurar reglas adicionales, como nombres de tablas
        // o relaciones complejas si el proyecto escalara.
    }
}