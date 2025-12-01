using MovieApp_backend.Model;

namespace MovieApp_backend.Dto
{
    public class AddUserMovieDto
    {
        public int UserId { get; set; }
        public int MovieId { get; set; }
        public MovieListType Type { get; set; }
    }
}
