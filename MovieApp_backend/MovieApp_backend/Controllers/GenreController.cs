using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApp_backend.Dto;
using MovieApp_backend.Model;
using System.Formats.Asn1;

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

        [HttpGet]
        public async Task<ActionResult> GetAllGenres()
        {
            var genre = await _context.Genres.AsNoTracking().Select(u => new GenreReadDto
            {
                GenreId = u.GenreId,
                Name = u.Name
            }).ToListAsync();

            return Ok(genre);
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

        [HttpPut("{id}")]
        public async Task<ActionResult<GenreReadDto>> UpdateGenre(int id, [FromForm] GenreCreateDto dto)
        {
            var genre = await _context.Genres.FindAsync(id);
            if (genre == null)
            {
                return NotFound($"No genre with id: {id} was found");
            }
            genre.Name = dto.Name;
            await _context.SaveChangesAsync();
            var result = new GenreReadDto
            {
                GenreId = genre.GenreId,
                Name = genre.Name
            };
            return Ok(result);
        }
    }
}
