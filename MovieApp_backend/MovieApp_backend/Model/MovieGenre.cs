using System.ComponentModel.DataAnnotations.Schema;

namespace MovieApp_backend.Model
{
    public class MovieGenre
    {
        public int MovieId { get; set; }
        public int GenreId { get; set; }

        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

        [ForeignKey("GenreId")]
        public Genre Genre { get; set; }
    }
}
