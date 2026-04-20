using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ViajesAltairis.Api.Models
{
    [Table("Habitaciones")]
    public class Habitacion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Numero { get; set; } = string.Empty; // Ejemplo: "101"

        [Required]
        public int TipoHabitacionId { get; set; }

        [ForeignKey("TipoHabitacionId")]
        public TipoHabitacion? TipoHabitacion { get; set; }

        [Required]
        public EstadoHabitacion Estado { get; set; } = EstadoHabitacion.Disponible;
    }
}