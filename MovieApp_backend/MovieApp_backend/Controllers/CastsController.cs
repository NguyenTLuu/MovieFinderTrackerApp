using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApp_backend.Dto;
using MovieApp_backend.Model;

namespace MovieApp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CastsController : ControllerBase
    {
        public readonly MovieAppContext _context;
        public CastsController(MovieAppContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetCastById(int id)
        {
            var cast = await _context.Casts.Where(c => c.CastId == id).Select(c => new CastReadDto
            {
                CastId = c.CastId,
                Name = c.Name,
                Country = c.Country.Name,
                Avatar = c.Avatar,
                birthYear = c.BirthdayYear,
                Gender = c.Gender,
                movies = c.MovieCasts.Select(m => new MovieCardDto
                {
                    MovieId = m.Movie.MovieId,
                    Title = m.Movie.Title,
                    ReleaseYear = m.Movie.ReleaseYear,
                    Poster = m.Movie.Poster,
                    Rating = m.Movie.Rating
                }).ToList()
            }).FirstOrDefaultAsync();


            if (cast == null)
            {
                return NotFound();
            }

            return Ok(cast);
        }
    }
}
