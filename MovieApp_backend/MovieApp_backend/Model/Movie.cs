namespace MovieApp_backend.Model
{
    public class Movie
    {
        public int MovieId { get; set; }
        public string Title { get; set; }
        public int ReleaseYear { get; set; }
        public ICollection<Genre> Genres { get; set; }
        public ICollection<Country> Countries { get; set; }
        public ICollection<Language> Languages { get; set; }
        public string Description { get; set; }
        public int DirectorId { get; set; }
        public Director Director { get; set; }
        public ICollection<Cast> Casts { get; set; }
        public string Poster { get; set; }
        public double Rating { get; set; }

    }
}
