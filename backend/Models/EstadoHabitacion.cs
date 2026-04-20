namespace ViajesAltairis.Api.Models
{
    public enum EstadoHabitacion
    {
        /// <summary> La habitación está limpia y lista para recibir huéspedes. </summary>
        Disponible,

        /// <summary> Hay un huésped ocupando la habitación actualmente. </summary>
        Ocupada,

        /// <summary> La habitación está bloqueada para una llegada inminente. </summary>
        Reservada,

        /// <summary> La habitación está fuera de servicio por reparaciones técnicas. </summary>
        Mantenimiento,

        /// <summary> El huésped salió y la habitación requiere limpieza antes de ser usada. </summary>
        Limpieza
    }
}