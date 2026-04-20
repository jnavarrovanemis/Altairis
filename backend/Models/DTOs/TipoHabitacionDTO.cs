namespace ViajesAltairis.Api.Models.DTOs
{
    public class TipoHabitacionDTO
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public string HotelNombre { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public decimal PrecioBase { get; set; }
        public int Capacidad { get; set; }
    }
}