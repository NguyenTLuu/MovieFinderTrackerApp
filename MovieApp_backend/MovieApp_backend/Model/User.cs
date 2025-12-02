using System.ComponentModel.DataAnnotations;

namespace MovieApp_backend.Model
{
    public class User
    {
        [Key]
        [MaxLength(450)]
        public string UserId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        [MaxLength(255)]
        public string Password { get; set; } 

        [Required]
        [EmailAddress] 
        [MaxLength(100)]
        public string Email { get; set; }

        [MaxLength(100)]
        public string FullName { get; set; }

        [MaxLength(2048)]
        public string Avatar { get; set; }

        [MaxLength(20)]
        public string Role { get; set; } = "User";

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public ICollection<UserMovie> UserMovies { get; set; }

        public bool IsVerified { get; set; } = false;

        [MaxLength(6)]
        public string? VerificationCode { get; set; }

        public DateTime? VerificationCodeExpiresAt { get; set; }

    }
}
