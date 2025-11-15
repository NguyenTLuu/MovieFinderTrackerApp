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
                .Include(m => m.MovieGenres)
                .Include(m => m.MovieCountries)
                .Include(m => m.MovieLanguages)
                .Include(m => m.MovieCasts)
                .Select(m => new MovieReadDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    ReleaseYear = m.ReleaseYear,
                    DirectorId = m.DirectorId,
                    GenreIds = m.MovieGenres.Select(mg => mg.GenreId).ToList(),
                    CountryIds = m.MovieCountries.Select(mc => mc.CountryId).ToList(),
                    LanguageIds = m.MovieLanguages.Select(ml => ml.LanguageId).ToList(),
                    CastIds = m.MovieCasts.Select(mca => mca.CastId).ToList(),
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
                MovieGenres = dto.GenreIds.Select(id => new MovieGenre { GenreId = id }).ToList(),
                MovieCountries = dto.CountryIds.Select(id => new MovieCountry { CountryId = id }).ToList(),
                MovieLanguages = dto.LanguageIds.Select(id => new MovieLanguage { LanguageId = id }).ToList(),
                MovieCasts = dto.CastIds.Select(id => new MovieCast { CastId = id }).ToList(),
                Description = dto.Description,
                Rating = dto.Rating,
                Backdrop = dto.Backdrop, 
                Runtime = dto.Runtime,   
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            var result = new MovieReadDto
            {
                MovieId = movie.MovieId,
                Title = movie.Title,
                ReleaseYear = movie.ReleaseYear,
                DirectorId = movie.DirectorId,
                GenreIds = movie.MovieGenres.Select(mg => mg.GenreId).ToList(),
                CountryIds = movie.MovieCountries.Select(mc => mc.CountryId).ToList(),
                LanguageIds = movie.MovieLanguages.Select(ml => ml.LanguageId).ToList(),
                CastIds = movie.MovieCasts.Select(mca => mca.CastId).ToList(),
                Rating = movie.Rating,
                Description = movie.Description,
                Poster = movie.Poster
            };

            return CreatedAtAction(nameof(GetMovieById), new { id = movie.MovieId }, result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovieReadDto>> GetMovieById(int id)
        {
            var movieDto = await _context.Movies
                .Where(m => m.MovieId == id)
                .Include(m => m.MovieGenres)
                .Include(m => m.MovieCountries)
                .Include(m => m.MovieLanguages)
                .Include(m => m.MovieCasts)
                .Select(m => new MovieReadDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    ReleaseYear = m.ReleaseYear,
                    DirectorId = m.DirectorId,
                    GenreIds = m.MovieGenres.Select(mg => mg.GenreId).ToList(),
                    CountryIds = m.MovieCountries.Select(mc => mc.CountryId).ToList(),
                    LanguageIds = m.MovieLanguages.Select(ml => ml.LanguageId).ToList(),
                    CastIds = m.MovieCasts.Select(mca => mca.CastId).ToList(),
                    Rating = m.Rating,
                    Description = m.Description,
                    Poster = m.Poster,
                    Backdrop = m.Backdrop,
                    Runtime = m.Runtime
                })
                .FirstOrDefaultAsync();

            if (movieDto == null)
            {
                return NotFound($"Movie with id: {id} is not found");
            }

            return Ok(movieDto); 
        }
    }
}
