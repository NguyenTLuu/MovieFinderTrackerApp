using System.ComponentModel.DataAnnotations;

namespace MovieApp_backend.Dto
{
    public class ChangePasswordDto
    {
        [Required]
        public string OldPassword { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }
    }

    public class UpdateProfileDto
    {
        public string? FullName { get; set; }

        public IFormFile? AvatarFile { get; set; }
    }
}