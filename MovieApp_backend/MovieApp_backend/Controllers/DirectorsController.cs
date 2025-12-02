using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApp_backend.Dto;
using MovieApp_backend.Model;

namespace MovieApp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorController : ControllerBase
    {
        public readonly MovieAppContext _context;
        public DirectorController(MovieAppContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetDirectorById(int id)
        {
            var director = await _context.Directors.AsNoTracking().Where(d => d.DirectorId == id)
                .Select(d => new DirectorReadDto
                {
                    DirectorId = d.DirectorId,
                    Name = d.Name,
                    Gender = d.Gender,
                    Country = d.Country.Name,
                    Avatar = d.Avatar,
                    birthYear = d.BirthdayYear,
                    movies = d.Movies.Select(m => new MovieCardDto
                    {
                        MovieId = m.MovieId,
                        Title = m.Title,
                        ReleaseYear = m.ReleaseYear,
                        Poster = m.Poster,
                        Rating = m.Rating
                    }).ToList()
                }).FirstOrDefaultAsync();
            return Ok(director);
        }
    }
}
