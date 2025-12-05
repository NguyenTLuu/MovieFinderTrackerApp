namespace MovieApp_backend.Dto
{
    public class DirectorReadDto
    {
        public int DirectorId { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string Gender { get; set; }
        public int birthYear { get; set; }  
        public string Avatar { get; set; }
        public string bio { get; set; }
        public List<MovieCardDto> movies { get; set; }
    }
}
