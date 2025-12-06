using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieApp_backend.Model
{
    public class UserMovie
    {
        public int MovieId { get; set; }
        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

        public int CustomListId { get; set; }
        [ForeignKey("CustomListId")]
        public CustomList CustomList { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.Now;
    }
}
