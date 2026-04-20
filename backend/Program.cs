using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using ViajesAltairis.Api.Data;
using ViajesAltairis.Api.Models;
using Bogus;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); // ← agregar
    });

builder.Services.AddOpenApi();

builder.Services.AddCors(options => {
    options.AddPolicy("PermitirFrontend", policy => {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("PermitirFrontend");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        context.Database.EnsureCreated();
        
        if (!context.Hoteles.Any())
        {
            Console.WriteLine("--> Iniciando inyección masiva de datos jerárquicos con Bogus...");

            var hotelFaker = new Faker<Hotel>("es")
                .RuleFor(h => h.Nombre, f => f.Company.CompanyName() + " Resort")
                .RuleFor(h => h.Ciudad, f => f.Address.City())
                .RuleFor(h => h.Estrellas, f => f.Random.Int(1, 5))
                .RuleFor(h => h.Activo, true);

            var hoteles = hotelFaker.Generate(15); 
            context.Hoteles.AddRange(hoteles);
            context.SaveChanges();

            Console.WriteLine($"--> {hoteles.Count} Hoteles creados.");

            var nombresTipo = new[] { "Sencilla", "Doble Estándar", "Suite de Lujo", "Presidencial", "Familiar" };
            var todasLasHabitacionesFisicas = new List<Habitacion>();

            foreach (var hotel in hoteles)
            {
                for (int i = 0; i < 3; i++)
                {
                    var tipo = new TipoHabitacion
                    {
                        HotelId = hotel.Id,
                        Nombre = nombresTipo[i],
                        PrecioBase = Math.Round(new Faker().Random.Decimal(60, 450), 2),
                        Capacidad = i + 1
                    };
                    context.TiposHabitacion.Add(tipo);
                    context.SaveChanges();

                    for (int j = 1; j <= 5; j++)
                    {
                        todasLasHabitacionesFisicas.Add(new Habitacion
                        {
                            TipoHabitacionId = tipo.Id,
                            Numero = $"{tipo.Id}{j:00}",
                            Estado = new Faker().PickRandom<EstadoHabitacion>()
                        });
                    }
                }
            }
            context.Habitaciones.AddRange(todasLasHabitacionesFisicas);
            context.SaveChanges();
            Console.WriteLine($"--> {todasLasHabitacionesFisicas.Count} Unidades físicas distribuidas.");

            var reservaFaker = new Faker<Reserva>("es")
                .RuleFor(r => r.HabitacionId, f => f.PickRandom(todasLasHabitacionesFisicas).Id)
                .RuleFor(r => r.NombreHuesped, f => f.Name.FullName())
                .RuleFor(r => r.FechaEntrada, f => f.Date.Soon(30))
                .RuleFor(r => r.FechaSalida, (f, r) => r.FechaEntrada.AddDays(f.Random.Int(1, 10)))
                .RuleFor(r => r.Estado, f => f.PickRandom<EstadoReserva>());

            var reservas = reservaFaker.Generate(100);
            context.Reservas.AddRange(reservas);
            context.SaveChanges();

            Console.WriteLine($"--> {reservas.Count} Reservas vinculadas a unidades físicas.");
            Console.WriteLine("--> ¡Base de datos de Altairis lista para producción!");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--> ERROR CRÍTICO EN SEED DATA: {ex.Message}");
        if (ex.InnerException != null) 
            Console.WriteLine($"--> Inner Exception: {ex.InnerException.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.MapGet("/ping", () => Results.Ok(new { 
    Status = "Online", 
    System = "Viajes Altairis API", 
    Time = DateTime.Now 
}));

app.Run();