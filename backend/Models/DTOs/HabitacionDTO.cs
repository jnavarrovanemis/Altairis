namespace ViajesAltairis.Api.Models.DTOs
{
    public class HabitacionDTO
    {
        public int Id { get; set; }
        public string Numero { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty; // Lo enviamos como string para el front
        
        public string HotelNombre { get; set; } = string.Empty;
        // Datos del Tipo relacionados
        public int TipoHabitacionId { get; set; }
        public string TipoNombre { get; set; } = string.Empty;
        public decimal PrecioBase { get; set; }
        public int Capacidad { get; set; }
    }
}