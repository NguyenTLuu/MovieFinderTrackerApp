using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApp_backend.Dto;
using MovieApp_backend.Model;
using System.Security.Claims;

namespace MovieApp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMovieController : ControllerBase
    {
        private readonly MovieAppContext _context;

        public UserMovieController(MovieAppContext context)
        {
            _context = context;
        }

        private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // 1. Thêm phim vào một danh sách cụ thể
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddMovieToList([FromBody] AddMovieToListDto dto)
        {
            var userId = GetUserId();

            // Kiểm tra xem List này có phải của User đó không
            var customList = await _context.CustomLists
                .FirstOrDefaultAsync(cl => cl.CustomListId == dto.CustomListId && cl.UserId == userId);

            if (customList == null) return BadRequest("List not found or access denied.");

            // Kiểm tra xem phim đã có trong list chưa
            var exists = await _context.UserMovies
                .AnyAsync(um => um.CustomListId == dto.CustomListId && um.MovieId == dto.MovieId);

            if (exists) return BadRequest("Movie already in this list.");

            var newItem = new UserMovie
            {
                CustomListId = dto.CustomListId,
                MovieId = dto.MovieId,
                AddedAt = DateTime.Now
            };

            _context.UserMovies.Add(newItem);
            await _context.SaveChangesAsync();

            return Ok("Movie added to list.");
        }

        // 2. Xóa phim khỏi danh sách
        [HttpPost("remove")]
        [Authorize]
        public async Task<IActionResult> RemoveMovieFromList([FromBody] AddMovieToListDto dto)
        {
            var userId = GetUserId();

            // Cần join bảng CustomList để chắc chắn user đang xóa phim khỏi list CỦA MÌNH
            var item = await _context.UserMovies
                .Include(um => um.CustomList)
                .FirstOrDefaultAsync(um =>
                    um.CustomListId == dto.CustomListId &&
                    um.MovieId == dto.MovieId &&
                    um.CustomList.UserId == userId);

            if (item == null) return NotFound("Movie not found in your list.");

            _context.UserMovies.Remove(item);
            await _context.SaveChangesAsync();

            return Ok("Movie removed from list.");
        }

        // 3. Lấy danh sách phim trong 1 List cụ thể
        [HttpGet("list/{listId}")]
        [Authorize]
        public async Task<IActionResult> GetMoviesInList(int listId)
        {
            var userId = GetUserId();

            // Check quyền sở hữu list
            var isOwner = await _context.CustomLists.AnyAsync(cl => cl.CustomListId == listId && cl.UserId == userId);
            if (!isOwner) return Unauthorized("Access denied.");

            var movies = await _context.UserMovies
                .Where(um => um.CustomListId == listId)
                .Include(um => um.Movie)
                .OrderByDescending(um => um.AddedAt)
                .Select(um => new MovieCardDto // Dùng lại DTO cũ của bạn
                {
                    MovieId = um.MovieId,
                    Title = um.Movie.Title,
                    Poster = um.Movie.Poster,
                    Rating = um.Movie.Rating,
                    ReleaseYear = um.Movie.ReleaseYear
                })
                .ToListAsync();

            return Ok(movies);
        }

        [HttpGet("check/{movieId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<int>>> CheckMovieInLists(int movieId)
        {
            var userId = GetUserId();

            // Tìm tất cả UserMovie của user này với movieId tương ứng
            // Sau đó chỉ lấy ra CustomListId
            var listIds = await _context.UserMovies
                .Where(um => um.MovieId == movieId && um.CustomList.UserId == userId)
                .Select(um => um.CustomListId)
                .ToListAsync();

            return Ok(listIds); // Kết quả trả về VD: [1, 2, 10]
        }
    }
}