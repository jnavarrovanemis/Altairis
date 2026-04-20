namespace ViajesAltairis.Api.Models.DTOs
{
    public class ReservaDTO
    {
        public int Id { get; set; }
        public int HabitacionId { get; set; } 
        public string NombreHuesped { get; set; } = string.Empty;
        public DateTime FechaEntrada { get; set; }
        public DateTime FechaSalida { get; set; }
        public string Estado { get; set; } = string.Empty;

        // Información de contexto para el usuario
        public string NumeroHabitacion { get; set; } = string.Empty;
        public string TipoHabitacionNombre { get; set; } = string.Empty;
        public string HotelNombre { get; set; } = string.Empty;
        public decimal PrecioPorNoche { get; set; }
    }
}