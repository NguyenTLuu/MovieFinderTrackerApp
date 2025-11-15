using System.ComponentModel.DataAnnotations.Schema;

namespace MovieApp_backend.Model
{
    public class MovieCast
    {
        public int MovieId { get; set; }
        public int CastId { get; set; }

        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

        [ForeignKey("CastId")]
        public Cast Cast { get; set; }
    }
}
