using System.ComponentModel.DataAnnotations;

namespace MovieApp_backend.Dto
{
    public class CustomListDto
    {
        public int CustomListId { get; set; }
        public string Name { get; set; }
        public bool IsSystemDefault { get; set; }
        public int MovieCount { get; set; }
    }

    public class CreateListDto
    {
        [Required]
        public string Name { get; set; }
    }

    public class AddMovieToListDto
    {
        public int MovieId { get; set; }
        public int CustomListId { get; set; }
    }
}
