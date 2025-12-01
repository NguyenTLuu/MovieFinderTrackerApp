using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApp_backend.Model;

namespace MovieApp_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguagesController : ControllerBase
    {
        private readonly MovieAppContext _context;

        public LanguagesController(MovieAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetLanguages()
        {
            var languages = await _context.Languages
                .AsNoTracking()
                .Select(m => new
                {
                    LanguageId = m.LanguageId,
                    Name = m.Name
                })
                .ToListAsync();

            return Ok(languages);
        }
    }
}
