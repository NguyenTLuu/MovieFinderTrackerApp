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
    public class CustomListController : ControllerBase
    {
        private readonly MovieAppContext _context;

        public CustomListController(MovieAppContext context)
        {
            _context = context;
        }

        // Helper để lấy UserId từ Token
        private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CustomListDto>>> GetMyLists()
        {
            var userId = GetUserId();

            var lists = await _context.CustomLists
                .Where(cl => cl.UserId == userId)
                .Select(cl => new CustomListDto
                {
                    CustomListId = cl.CustomListId,
                    Name = cl.Name,
                    IsSystemDefault = cl.IsSystemDefault,
                    MovieCount = _context.UserMovies.Count(um => um.CustomListId == cl.CustomListId)
                })
                .ToListAsync();

            return Ok(lists);
        }

        // 2. Tạo danh sách mới
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateList([FromBody] CreateListDto dto)
        {
            var userId = GetUserId();

            var newList = new CustomList
            {
                Name = dto.Name,
                UserId = userId,
                IsSystemDefault = false, // List do user tạo thì cho phép xóa
                CreatedAt = DateTime.Now
            };

            _context.CustomLists.Add(newList);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "List created", CustomListId = newList.CustomListId, name = newList.Name });
        }

        // 3. Xóa danh sách
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteList(int id)
        {
            var userId = GetUserId();
            var list = await _context.CustomLists.FirstOrDefaultAsync(cl => cl.CustomListId == id && cl.UserId == userId);

            if (list == null) return NotFound("List not found");

            if (list.IsSystemDefault)
            {
                return BadRequest("Cannot delete system default lists (Watchlist/Watched).");
            }

            // Xóa list (Các UserMovie bên trong sẽ tự mất nếu chưa config cascade, 
            // nhưng vì mình set NoAction nên tốt nhất xóa tay các phim trong đó trước)
            var moviesInList = _context.UserMovies.Where(um => um.CustomListId == id);
            _context.UserMovies.RemoveRange(moviesInList);

            _context.CustomLists.Remove(list);
            await _context.SaveChangesAsync();

            return Ok("List deleted");
        }
    }
}