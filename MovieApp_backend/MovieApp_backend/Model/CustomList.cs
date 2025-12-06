using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieApp_backend.Model
{
    public class CustomList
    {
        [Key]
        public int CustomListId { get; set; }

        [Required]
        public string Name { get; set; } 

        public bool IsSystemDefault { get; set; } = false; 

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Required]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}