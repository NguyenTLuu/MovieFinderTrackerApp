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
                .Select(m => new MovieReadDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    ReleaseYear = m.ReleaseYear,
                    GenreNames = m.MovieGenres.Select(mg => mg.Genre.Name).ToList(),
                    CountryNames = m.MovieCountries.Select(mc => mc.Country.Name).ToList(),
                    LanguageNames = m.MovieLanguages.Select(ml => ml.Language.Name).ToList(),
                    Rating = m.Rating,
                    Description = m.Description,
                    Poster = m.Poster,
                    Backdrop = m.Backdrop,
                    Runtime = m.Runtime,

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
                Trailer = dto.Trailer
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            var result = new MovieReadDto
            {
                MovieId = movie.MovieId,
                Title = movie.Title,
                ReleaseYear = movie.ReleaseYear,
                GenreNames = movie.MovieGenres.Select(mg => mg.Genre.Name).ToList(),
                CountryNames = movie.MovieCountries.Select(mc => mc.Country.Name).ToList(),
                LanguageNames = movie.MovieLanguages.Select(ml => ml.Language.Name).ToList(),
                Rating = movie.Rating,
                Description = movie.Description,
                Poster = movie.Poster,
                Backdrop = movie.Backdrop,
                Runtime = movie.Runtime,
            };

            return CreatedAtAction(nameof(GetMovieById), new { message = "Created successfully", id = movie.MovieId }, result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovieReadDto>> GetMovieById(int id)
        {
            var movieDto = await _context.Movies
                .Where(m => m.MovieId == id)
                .Select(m => new MovieReadDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    ReleaseYear = m.ReleaseYear,
                    GenreNames = m.MovieGenres.Select(mg => mg.Genre.Name).ToList(),
                    CountryNames = m.MovieCountries.Select(mc => mc.Country.Name).ToList(),
                    LanguageNames = m.MovieLanguages.Select(ml => ml.Language.Name).ToList(),
                    Director = new DirectorReadDto
                    {
                        DirectorId = m.Director.DirectorId,
                        Name = m.Director.Name,
                        Avatar = m.Director.Avatar,
                    },
                    Casts = m.MovieCasts.Select(mca => new CastReadDto
                    {
                        CastId = mca.Cast.CastId,
                        Name = mca.Cast.Name,
                        Avatar = mca.Cast.Avatar,
                    }).ToList(),
                    Rating = m.Rating,
                    Description = m.Description,
                    Poster = m.Poster,
                    Backdrop = m.Backdrop,
                    Runtime = m.Runtime,
                    Trailer = m.Trailer
                })
                .FirstOrDefaultAsync();

            if (movieDto == null)
            {
                return NotFound($"Movie with id: {id} is not found");
            }

            return Ok(movieDto);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<MovieReadDto>>> SearchMovies(
            [FromQuery] string? title,
            [FromQuery] int? releaseYear,
            [FromQuery] int? genreId,
            [FromQuery] int? languageId,
            [FromQuery] int? directorId,
            [FromQuery] int? castId)
        {
            var query = _context.Movies.AsNoTracking().AsQueryable();

            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(m => m.Title.Contains(title));
            }

            if (releaseYear.HasValue)
            {
                query = query.Where(m => m.ReleaseYear == releaseYear.Value);
            }

            if (genreId.HasValue)
            {
                query = query.Where(m => m.MovieGenres.Any(mg => mg.GenreId == genreId.Value));
            }

            if (languageId.HasValue)
            {
                query = query.Where(m => m.MovieLanguages.Any(ml => ml.LanguageId == languageId.Value));
            }

            if (directorId.HasValue)
            {
                query = query.Where(m => m.DirectorId == directorId);
            }

            if (castId.HasValue)
            {
                query = query.Where(m => m.MovieCasts.Any(mc => mc.CastId == castId));
            }

            var movies = await query
                .Select(m => new MovieReadDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    ReleaseYear = m.ReleaseYear,
                    GenreNames = m.MovieGenres.Select(mg => mg.Genre.Name).ToList(),
                    CountryNames = m.MovieCountries.Select(mc => mc.Country.Name).ToList(),
                    LanguageNames = m.MovieLanguages.Select(ml => ml.Language.Name).ToList(),
                    Director = new DirectorReadDto
                    {
                        DirectorId = m.Director.DirectorId,
                        Name = m.Director.Name,
                        Avatar = m.Director.Avatar,
                    },
                    Casts = m.MovieCasts.Select(mca => new CastReadDto
                    {
                        CastId = mca.Cast.CastId,
                        Name = mca.Cast.Name,
                        Avatar = mca.Cast.Avatar,
                    }).ToList(),
                    Rating = m.Rating,
                    Description = m.Description,
                    Poster = m.Poster,
                    Backdrop = m.Backdrop,
                    Runtime = m.Runtime,
                    Trailer = m.Trailer
                })
                .ToListAsync();
            return Ok(movies);
        }

    }
}
