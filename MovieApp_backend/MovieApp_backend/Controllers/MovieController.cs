using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApp_backend.Dto;
using MovieApp_backend.Model;

namespace MovieApp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly MovieAppContext _context;

        public MovieController(MovieAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieReadDto>>> GetMovies()
        {
            var movies = await _context.Movies
                .Include(m => m.Genres)
                .Select(m => new MovieReadDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    ReleaseYear = m.ReleaseYear,
                    DirectorId = m.DirectorId,
                    GenreIds = m.Genres.Select(g => g.GenreId).ToList(),
                    CountryIds = m.Countries.Select(g => g.CountryId).ToList(),
                    LanguageIds = m.Languages.Select(g => g.LanguageId).ToList(),
                    CastIds = m.Casts.Select(g => g.CastId).ToList(),
                    Rating = m.Rating,
                    Description = m.Description,
                    Poster = m.Poster

                })
                .ToListAsync();

            return Ok(movies);
        }
        [HttpPost]
        public async Task<ActionResult<MovieReadDto>> AddMovie([FromForm] MovieCreateDto dto)
        {
            var movie = new Movie
            {
                Title = dto.Title,
                ReleaseYear = dto.ReleaseYear,
                DirectorId = dto.DirectorId,
                Genres = await _context.Genres
                    .Where(g => dto.GenreIds.Contains(g.GenreId))
                    .ToListAsync(),
                Poster = dto.Poster,
                Description = dto.Description,
                Languages = await _context.Languages
                    .Where(l => dto.LanguageIds.Contains(l.LanguageId))
                    .ToListAsync(),
                Countries = await _context.Countries
                    .Where(c => dto.CountryIds.Contains(c.CountryId))
                    .ToListAsync(),
                Casts = await _context.Casts
                    .Where(ca => dto.CastIds.Contains(ca.CastId))
                    .ToListAsync(),
                Rating = dto.Rating
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            var result = new MovieReadDto
            {
                MovieId = movie.MovieId,
                Title = movie.Title,
                ReleaseYear = movie.ReleaseYear,
                DirectorId = movie.DirectorId,
                GenreIds = movie.Genres.Select(g => g.GenreId).ToList(),
                CountryIds = movie.Countries.Select(c => c.CountryId).ToList(),
                LanguageIds = movie.Languages.Select(l => l.LanguageId).ToList(),
                CastIds = movie.Casts.Select(ca => ca.CastId).ToList(),
                Rating = movie.Rating
            };

            return CreatedAtAction(nameof(GetMovieById), new { id = movie.MovieId }, result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovieById(int id)
        {
            var movie = await _context.Movies.Where(m => m.MovieId == id).FirstOrDefaultAsync();
            if (movie == null)
            {
                return NotFound($"Movie with id: {id} is not found");
            }

            return Ok(movie);
        }
    }
}
