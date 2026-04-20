namespace ViajesAltairis.Api.Models
{
    public enum EstadoReserva
    {
        /// <summary>
        /// La reserva ha sido creada pero aún no se ha confirmado (ej. falta pago o validación).
        /// </summary>
        Pendiente,

        /// <summary>
        /// La reserva está lista y el hotel espera al huésped.
        /// </summary>
        Confirmada,

        /// <summary>
        /// El huésped ha llegado y está ocupando la habitación.
        /// </summary>
        CheckIn,

        /// <summary>
        /// El huésped ha dejado la habitación y se ha cerrado la cuenta.
        /// </summary>
        CheckOut,

        /// <summary>
        /// La reserva ha sido anulada por el cliente o el hotel.
        /// </summary>
        Cancelada
    }
}