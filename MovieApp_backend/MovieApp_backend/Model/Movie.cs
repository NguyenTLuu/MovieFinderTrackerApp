using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieApp_backend.Model
{
    public class Movie
    {
        [Key]   
        public int MovieId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public int ReleaseYear { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        public int DirectorId { get; set; }

        [ForeignKey("DirectorId")]
        public Director Director { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Poster { get; set; }

        [Required]
        public double Rating { get; set; }

        [Required]
        public int Runtime { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Backdrop { get; set; }
        public ICollection<MovieCast> MovieCasts { get; set; }
        public ICollection<MovieGenre> MovieGenres { get; set; }
        public ICollection<MovieCountry> MovieCountries { get; set; }
        public ICollection<MovieLanguage> MovieLanguages { get; set; }
    }
}
