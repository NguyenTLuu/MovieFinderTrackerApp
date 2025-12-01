namespace MovieApp_backend.Dto
{
    public class MovieReadDto
    {
        public int MovieId { get; set; }
        public string Title { get; set; }
        public int ReleaseYear { get; set; }
        public string Description { get; set; }
        public string Poster { get; set; }
        public double Rating { get; set; }
        public List<string> GenreNames { get; set; }
        public List<string> LanguageNames { get; set; }
        public List<string> CountryNames { get; set; }
        public List<CastReadDto> Casts { get; set; }
        public DirectorReadDto Director { get; set; }
        public string Trailer {  get; set; }
        public int Runtime { get; set; }
        public string Backdrop { get; set; }
    }

    public class MovieCreateDto
    {
        public string Title { get; set; }
        public int ReleaseYear { get; set; }
        public string Description { get; set; }
        public string Poster { get; set; }
        public List<int> GenreIds { get; set; }
        public List<int> LanguageIds { get; set; }
        public List<int> CountryIds { get; set; }
        public List<int> CastIds { get; set; }
        public string Trailer { get; set; }
        public int DirectorId { get; set; }
        public double Rating { get; set; }
        public int Runtime { get; set; }
        public string Backdrop { get; set; }

    }
}
