namespace MovieApp_backend.Dto
{
    public class GenreCreateDto
    {
        public int GenreId { get; set; }
        public string Name { get; set; }

    }

    public class GenreReadDto
    {
        public int GenreId { get; set; }
        public string Name { get; set; }
    }
}
