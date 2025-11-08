namespace MovieApp_backend.Model
{
    public class Language
    {
        public int LanguageId { get; set; }
        public string Name { get; set; }

        public ICollection<Movie> Movies { get; set; }
    }
}
