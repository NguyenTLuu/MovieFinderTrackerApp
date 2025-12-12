using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MovieApp_backend.Dto;
using MovieApp_backend.Model;
using MovieApp_backend.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MovieApp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MovieAppContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthController(MovieAppContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                {
                    return BadRequest("Email already exists.");
                }

                var user = new User
                {
                    Username = dto.Username,
                    Email = dto.Email,
                    FullName = dto.FullName,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    VerificationCode = new Random().Next(100000, 999999).ToString(),
                    VerificationCodeExpiresAt = DateTime.Now.AddMinutes(15),
                    IsVerified = false,
                    Role = "User"
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var defaultLists = new List<CustomList>
                {
                    new CustomList { Name = "Watchlist", UserId = user.UserId, IsSystemDefault = true },
                    new CustomList { Name = "Watched", UserId = user.UserId, IsSystemDefault = true }
                };

                _context.CustomLists.AddRange(defaultLists);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                try
                {
                    await _emailService.SendEmailAsync(user.Email, "Verify your account",
                        $"Your verification code is: {user.VerificationCode}");
                }
                catch (Exception emailEx)
                {
                    return Ok("Registration successful, but email failed to send. Please request code resend.");
                }

                return Ok("Registration successful. Please check your email.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify(VerifyDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return BadRequest("User not found.");

            if (user.IsVerified) return BadRequest("User already verified.");

            if (user.VerificationCode != dto.Code)
            {
                return BadRequest("Invalid verification code.");
            }

            if (user.VerificationCodeExpiresAt < DateTime.Now)
            {
                return BadRequest("Verification code expired.");
            }

            user.IsVerified = true;
            user.VerificationCode = null;
            user.VerificationCodeExpiresAt = null;

            await _context.SaveChangesAsync();

            return Ok("Account verified successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return BadRequest("User not found.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                return BadRequest("Wrong password.");
            }

            if (!user.IsVerified)
            {
                return BadRequest("Account not verified. Please verify your email.");
            }

            string token = CreateToken(user);

            return Ok(new { Token = token, UserId = user.UserId, Username = user.Username, Role = user.Role, Fullname = user.FullName, avatar = user.Avatar });
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}