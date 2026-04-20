using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ViajesAltairis.Api.Models
{
    [Table("Hoteles")]
    public class Hotel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; } = string.Empty;

        public string Ciudad { get; set; } = string.Empty;

        public int Estrellas { get; set; }

        public bool Activo { get; set; } = true;
    }
}