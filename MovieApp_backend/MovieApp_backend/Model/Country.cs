using System.ComponentModel.DataAnnotations;

namespace MovieApp_backend.Model
{
    public class Country
    {
        [Key]
        public int CountryId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        public ICollection<MovieCountry> MovieCountries { get; set; }
        public ICollection<Director> Directors { get; set; }
        public ICollection<Cast> Casts { get; set; }
    }
}
