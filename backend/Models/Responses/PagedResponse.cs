namespace ViajesAltairis.Api.Models.Responses
{
    public class PagedResponse<T>
    {
        public int TotalRegistros { get; set; }
        public int PaginaActual { get; set; }
        public int TamanoPagina { get; set; }
        public int TotalPaginas => (int)Math.Ceiling((double)TotalRegistros / TamanoPagina);
        public IEnumerable<T> Datos { get; set; }

        public PagedResponse(IEnumerable<T> datos, int totalRegistros, int paginaActual, int tamanoPagina)
        {
            Datos = datos;
            TotalRegistros = totalRegistros;
            PaginaActual = paginaActual;
            TamanoPagina = tamanoPagina;
        }
    }
}