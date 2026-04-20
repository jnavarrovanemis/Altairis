using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ViajesAltairis.Api.Models
{
    [Table("TiposHabitacion")]
    public class TipoHabitacion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int HotelId { get; set; }

        [ForeignKey("HotelId")]
        public Hotel? Hotel { get; set; }

        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioBase { get; set; }

        public int Capacidad { get; set; }

        // Relación: Un tipo tiene muchas habitaciones físicas
        public ICollection<Habitacion> Habitaciones { get; set; } = new List<Habitacion>();
    }
}