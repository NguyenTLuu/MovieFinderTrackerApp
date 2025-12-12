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
    public class ReviewController : ControllerBase
    {
        private readonly MovieAppContext _context;

        public ReviewController(MovieAppContext context)
        {
            _context = context;
        }

        private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddReview([FromBody] ReviewCreateDto dto)
        {
            var userId = GetUserId();

            // Check xem đã review chưa
            var exists = await _context.Reviews
                .AnyAsync(r => r.UserId == userId && r.MovieId == dto.MovieId);

            if (exists) return BadRequest("You already reviewed this movie.");

            var review = new Review
            {
                UserId = userId,
                MovieId = dto.MovieId,
                Rating = dto.Rating,
                Content = dto.Content,
                CreatedAt = DateTime.Now
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok("Review added.");
        }

        [HttpGet("movie/{movieId}")]
        public async Task<ActionResult<IEnumerable<ReviewReadDto>>> GetReviews(int movieId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.MovieId == movieId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewReadDto
                {
                    ReviewId = r.ReviewId,
                    UserName = r.User.Username,
                    UserAvatar = r.User.Avatar,
                    Rating = r.Rating,
                    Content = r.Content,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("my-reviews")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetMyReviews()
        {
            var userId = GetUserId();

            var reviews = await _context.Reviews
                .Include(r => r.Movie)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    ReviewId = r.ReviewId,
                    MovieId = r.MovieId,
                    MovieTitle = r.Movie.Title,
                    MoviePoster = r.Movie.Poster,
                    Rating = r.Rating,
                    Content = r.Content,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var userId = GetUserId();
            var review = await _context.Reviews.FindAsync(id);

            if (review == null) return NotFound();
            if (review.UserId != userId) return Unauthorized("Not your review.");

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return Ok("Deleted.");
        }
    }
}