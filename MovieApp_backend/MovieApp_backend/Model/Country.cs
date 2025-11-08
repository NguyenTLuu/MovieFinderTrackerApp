namespace MovieApp_backend.Model
{
    public class Country
    {
        public int CountryId { get; set; }
        public string Name { get; set; }

        public ICollection<Movie> Movies { get; set; }  
    }
}
