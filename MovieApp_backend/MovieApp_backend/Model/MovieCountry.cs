using System.ComponentModel.DataAnnotations.Schema;

namespace MovieApp_backend.Model
{
    public class MovieCountry
    {
        public int MovieId { get; set; }
        public int CountryId { get; set; }

        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

        [ForeignKey("CountryId")]
        public Country Country { get; set; }
    }
}
