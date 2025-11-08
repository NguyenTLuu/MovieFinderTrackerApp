using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApp_backend.Dto;
using MovieApp_backend.Model;

namespace MovieApp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly MovieAppContext _context;

        public GenreController(MovieAppContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<GenreReadDto>> AddGenre([FromForm]GenreCreateDto dto)
        {
            var newGenre = new Genre
            {
                Name = dto.Name,
            };

            _context.Genres.Add(newGenre);
            await _context.SaveChangesAsync();

            var result = new GenreReadDto
            {
                GenreId = newGenre.GenreId,
                Name = newGenre.Name
            };

            return CreatedAtAction(nameof(GetGenreById), new { id = result.GenreId }, result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GenreReadDto>> GetGenreById(int id)
        {
            var genre = await _context.Genres.Where(g => g.GenreId == id)
                .Select(g => new GenreReadDto
                {
                    GenreId = g.GenreId,
                    Name = g.Name
                }).FirstOrDefaultAsync();

            if (genre == null)
            {
                return NotFound($"No genre with id: {id} was found");
            }

            return Ok(genre);

        }
    }
}
