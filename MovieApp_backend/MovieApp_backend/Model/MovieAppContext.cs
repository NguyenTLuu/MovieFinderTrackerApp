using Microsoft.EntityFrameworkCore;

namespace MovieApp_backend.Model
{
    public class MovieAppContext : DbContext
    {
        public MovieAppContext(DbContextOptions<MovieAppContext> options) : base(options)
        {
        }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<Director> Directors { get; set; }
        public DbSet<Cast> Casts { get; set; }
        public DbSet<MovieCast> MovieCast { get; set; }
        public DbSet<MovieGenre> MovieGenre { get; set; }
        public DbSet<MovieCountry> MovieCountry { get; set; }
        public DbSet<MovieLanguage> MovieLanguage { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserMovie> UserMovies { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MovieCountry>()
                .HasKey(mc => new { mc.CountryId, mc.MovieId });

            modelBuilder.Entity<MovieGenre>()
                .HasKey(mg => new { mg.GenreId, mg.MovieId });

            modelBuilder.Entity<MovieCast>()
                .HasKey(mc => new { mc.CastId, mc.MovieId });

            modelBuilder.Entity<MovieLanguage>()
                .HasKey(ml => new { ml.LanguageId, ml.MovieId });

            modelBuilder.Entity<UserMovie>()
                .HasKey(um => new { um.UserId, um.MovieId });
        }
    }
}
