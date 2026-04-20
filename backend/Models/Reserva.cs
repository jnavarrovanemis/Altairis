using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ViajesAltairis.Api.Models
{
    [Table("Reservas")]
    public class Reserva
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int HabitacionId { get; set; } // <--- Ahora apunta a la habitación física

        [ForeignKey("HabitacionId")]
        public Habitacion? Habitacion { get; set; }

        [Required]
        public DateTime FechaEntrada { get; set; }

        [Required]
        public DateTime FechaSalida { get; set; }

        [Required]
        public string NombreHuesped { get; set; } = string.Empty;

        [Required]
        public EstadoReserva Estado { get; set; } = EstadoReserva.Pendiente;

        // Propiedad calculada útil para el front
        [NotMapped]
        public int CantidadNoches => (FechaSalida - FechaEntrada).Days;
    }
}