namespace MovieApp_backend.Model
{
    public class Director
    {
        public int DirectorId { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Avatar { get; set; }
        public int BirthdayYear { get; set; }
        public ICollection<Movie> Movies { get; set; }
    }
}
