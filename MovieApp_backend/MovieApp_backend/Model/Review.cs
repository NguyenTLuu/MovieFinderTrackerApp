using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieApp_backend.Model
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }

        [Required]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        public int MovieId { get; set; }
        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}