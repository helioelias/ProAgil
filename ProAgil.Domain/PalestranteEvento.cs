namespace ProAgil.Domain
{
    public class PalestranteEvento
    {
        public int EventoId { get; set; }
        public int PalestranteId { get; set; }

        public Palestrante Palestrante { get;}
        public Evento Evento { get; }
        
    }
}