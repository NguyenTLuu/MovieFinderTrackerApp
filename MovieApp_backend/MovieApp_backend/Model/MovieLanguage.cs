using System.ComponentModel.DataAnnotations.Schema;

namespace MovieApp_backend.Model
{
    public class MovieLanguage
    {
        public int MovieId { get; set; }
        public int LanguageId { get; set; }

        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

        [ForeignKey("LanguageId")]
        public Language Language { get; set; }
    }
}
