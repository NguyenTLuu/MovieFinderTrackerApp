using System.ComponentModel.DataAnnotations;

namespace MovieApp_backend.Dto
{
    public class ReviewCreateDto
    {
        public int MovieId { get; set; }
        [Range(1, 5)]
        public int Rating { get; set; }
        public string? Content { get; set; }
    }

    public class ReviewReadDto
    {
        public int ReviewId { get; set; }
        public string UserName { get; set; }
        public string UserAvatar { get; set; }
        public int Rating { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
