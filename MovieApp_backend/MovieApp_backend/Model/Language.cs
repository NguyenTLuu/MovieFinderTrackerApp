using System.ComponentModel.DataAnnotations;

namespace MovieApp_backend.Model
{
    public class Language
    {
        [Key]
        public int LanguageId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public ICollection<MovieLanguage> MovieLanguages { get; set; }
    }
}
