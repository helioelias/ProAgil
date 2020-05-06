using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
         void Add<T>(T entity) where T : class;
         void Update<T>(T entity) where T : class;
         void Delete<T>(T entity) where T : class;
         void DeleteRange<T>(T[] entity) where T : class;

         Task<bool> SaveChangesAsync();

         Task<Evento[]> GetAllEventosAsyncByTema(string tema, bool includePalestrantes);
         Task<Evento[]> GetAllEventosAsync(bool includePalestrantes);
         Task<Evento> GetEventoAsync(int EventoId, bool includePalestrantes);

         Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos);
         Task<Palestrante[]> GetAllPalestrantesAsyncByName(string nome, bool includeEventos);
         Task<Palestrante> GetPalestranteAsync(int PalestranteId, bool includeEventos);
        
    }
}