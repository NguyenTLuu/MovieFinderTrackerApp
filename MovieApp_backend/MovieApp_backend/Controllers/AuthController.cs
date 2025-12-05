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

        // 1. Đăng ký
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest("Email already exists.");
            }

            // Tạo mã xác nhận 6 số ngẫu nhiên
            var verificationCode = new Random().Next(100000, 999999).ToString();

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                FullName = dto.FullName,
                // Hash mật khẩu (Không lưu plain text)
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                VerificationCode = verificationCode,
                VerificationCodeExpiresAt = DateTime.Now.AddMinutes(15), // Hết hạn sau 15p
                IsVerified = false,
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Gửi email
            await _emailService.SendEmailAsync(user.Email, "Verify your account",
                $"Your verification code is: {verificationCode}");

            return Ok("Registration successful. Please check your email for the verification code.");
        }

        // 2. Xác thực Code
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

            // Kích hoạt tài khoản
            user.IsVerified = true;
            user.VerificationCode = null; // Xóa code sau khi dùng
            user.VerificationCodeExpiresAt = null;

            await _context.SaveChangesAsync();

            return Ok("Account verified successfully.");
        }

        // 3. Đăng nhập (Trả về JWT)
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return BadRequest("User not found.");

            // Kiểm tra mật khẩu
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                return BadRequest("Wrong password.");
            }

            // Kiểm tra đã kích hoạt chưa
            if (!user.IsVerified)
            {
                return BadRequest("Account not verified. Please verify your email.");
            }

            // Tạo Token JWT
            string token = CreateToken(user);

            return Ok(new { Token = token, UserId = user.UserId, Username = user.Username, Role = user.Role });
        }

        // Hàm tạo JWT Token
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