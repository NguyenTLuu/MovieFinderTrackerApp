using System.ComponentModel.DataAnnotations;

namespace MovieApp_backend.Model
{
    public class Director
    {
        [Key]
        public int DirectorId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public string Gender { get; set; }

        [Required]
        [MaxLength(2048)]
        public string Avatar { get; set; }

        [Required]
        public int BirthdayYear { get; set; }
        public ICollection<Movie> Movies { get; set; }
    }
}
