using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        public ProAgilContext _context { get; }
        public ProAgilRepository(ProAgilContext context)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }
        public void Add<T>(T entity) where T : class
        {
            this._context.Add(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            this._context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            this._context.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await this._context.SaveChangesAsync()) > 0;
        }   

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(w => w.Lotes)
                .Include(w => w.RedeSociais);

            if(includePalestrantes){
                query = query
                .Include(w => w.PalestranteEventos);
            }

            query = query
            .AsNoTracking()
            .OrderByDescending(w => w.DataEvento);

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventosAsyncByTema(string tema, bool includePalestrantes = false)
        {
             IQueryable<Evento> query = _context.Eventos
                .Include(w => w.Lotes)
                .Include(w => w.RedeSociais);

                if(includePalestrantes){
                    query = query
                    .Include(w => w.PalestranteEventos);
                }
            query = query
            .AsNoTracking()
            .OrderByDescending(w => w.DataEvento)
            .Where(w => w.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }
        
        public async Task<Evento> GetEventoAsync(int EventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(w => w.Lotes)
                .Include(w => w.RedeSociais);

                if(includePalestrantes){
                    query = query
                    .Include(w => w.PalestranteEventos);
                }
            query = query
            .AsNoTracking()
            .OrderByDescending(w => w.DataEvento)
            .Where(w => w.Id == EventoId);


            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsyncByName(string nome, bool includeEventos = false)
        {
             IQueryable<Palestrante> query = _context.Palestrantes
                .Include(w => w.RedeSociais);

                if(includeEventos){
                    query = query
                    .Include(w => w.PalestranteEventos);
                }

                query = query
                .AsNoTracking()
                .OrderBy(w => w.Nome)
                .Where(w => w.Nome.ToLower().Contains(nome.ToLower()));
                

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestranteAsync(int PalestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(w => w.RedeSociais);

                if(includeEventos){
                    query = query
                    .Include(w => w.PalestranteEventos);
                }

                query = query
                .AsNoTracking()
                .Where(w => w.Id == PalestranteId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(w => w.RedeSociais);

            if(includeEventos){
                query = query
                .AsNoTracking()
                .Include(w => w.PalestranteEventos);
            }

            query = query.OrderBy(w => w.Nome);

            return await query.ToArrayAsync();
        }

             
    }
}