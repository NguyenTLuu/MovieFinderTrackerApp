using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieApp_backend.Model
{
    public class UserMovie
    {
        [MaxLength(450)]
        public string UserId { get; set; }

        public int MovieId { get; set; }

        [Required]
        public MovieListType Type { get; set; } 

        public DateTime AddedAt { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }
    }
}
