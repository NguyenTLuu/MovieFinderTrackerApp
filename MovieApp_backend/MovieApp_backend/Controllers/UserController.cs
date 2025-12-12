using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApp_backend.Dto;
using MovieApp_backend.Model;
using MovieApp_backend.Services;
using System.Security.Claims;

namespace MovieApp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly MovieAppContext _context;
        private readonly IFileService _fileService;

        public UserController(MovieAppContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound("User not found");

            return Ok(new
            {
                user.UserId,
                user.Username,
                user.Email,
                user.FullName,
                user.Avatar,
                user.Role
            });
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDto dto)
        {
            var userId = GetUserId();
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound("User not found");

            if (!string.IsNullOrEmpty(dto.FullName))
            {
                user.FullName = dto.FullName;
            }

            if (dto.AvatarFile != null)
            {
                if (!string.IsNullOrEmpty(user.Avatar)) _fileService.DeleteFile(user.Avatar);

                string avatarUrl = await _fileService.SaveFileAsync(dto.AvatarFile, "avatars");
                user.Avatar = avatarUrl;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Profile updated successfully", Avatar = user.Avatar, FullName = user.FullName });
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = GetUserId();
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound("User not found");

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.Password))
            {
                return BadRequest("Incorrect old password.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok("Password changed successfully.");
        }

        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            if (file == null) return BadRequest("No file uploaded.");

            var userId = GetUserId();
            var user = await _context.Users.FindAsync(userId);

            var avatarUrl = await _fileService.SaveFileAsync(file, "avatars");

            user.Avatar = avatarUrl;
            await _context.SaveChangesAsync();

            return Ok(new { AvatarUrl = avatarUrl });
        }
    }
}