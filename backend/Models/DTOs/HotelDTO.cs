namespace ViajesAltairis.Api.Models.DTOs
{
    public class HotelDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Ciudad { get; set; } = string.Empty;
        public int Estrellas { get; set; }
        public bool Activo { get; set; }
    }
}
