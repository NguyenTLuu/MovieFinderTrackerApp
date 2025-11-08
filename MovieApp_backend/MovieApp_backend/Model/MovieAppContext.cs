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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- One-to-Many: Director → Movies ---
            modelBuilder.Entity<Movie>()
                .HasOne(m => m.Director)
                .WithMany(d => d.Movies)
                .HasForeignKey(m => m.DirectorId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- Many-to-Many: Movie ↔ Genre ---
            modelBuilder.Entity<Movie>()
                .HasMany(m => m.Genres)
                .WithMany(g => g.Movies)
                .UsingEntity<Dictionary<string, object>>(
                    "MovieGenre",
                    j => j.HasOne<Genre>()
                          .WithMany()
                          .HasForeignKey("GenreId")
                          .OnDelete(DeleteBehavior.Cascade),
                    j => j.HasOne<Movie>()
                          .WithMany()
                          .HasForeignKey("MovieId")
                          .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.HasKey("MovieId", "GenreId");
                        j.ToTable("MovieGenre");
                    });

            // --- Many-to-Many: Movie ↔ Country ---
            modelBuilder.Entity<Movie>()
                .HasMany(m => m.Countries)
                .WithMany(c => c.Movies)
                .UsingEntity<Dictionary<string, object>>(
                    "MovieCountry",
                    j => j.HasOne<Country>()
                          .WithMany()
                          .HasForeignKey("CountryId")
                          .OnDelete(DeleteBehavior.Cascade),
                    j => j.HasOne<Movie>()
                          .WithMany()
                          .HasForeignKey("MovieId")
                          .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.HasKey("MovieId", "CountryId");
                        j.ToTable("MovieCountry");
                    });

            // --- Many-to-Many: Movie ↔ Language ---
            modelBuilder.Entity<Movie>()
                .HasMany(m => m.Languages)
                .WithMany(l => l.Movies)
                .UsingEntity<Dictionary<string, object>>(
                    "MovieLanguage",
                    j => j.HasOne<Language>()
                          .WithMany()
                          .HasForeignKey("LanguageId")
                          .OnDelete(DeleteBehavior.Cascade),
                    j => j.HasOne<Movie>()
                          .WithMany()
                          .HasForeignKey("MovieId")
                          .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.HasKey("MovieId", "LanguageId");
                        j.ToTable("MovieLanguage");
                    });

            // --- Many-to-Many: Movie ↔ Cast ---
            modelBuilder.Entity<Movie>()
                .HasMany(m => m.Casts)
                .WithMany(c => c.Movies)
                .UsingEntity<Dictionary<string, object>>(
                    "MovieCast",
                    j => j.HasOne<Cast>()
                          .WithMany()
                          .HasForeignKey("CastId")
                          .OnDelete(DeleteBehavior.Cascade),
                    j => j.HasOne<Movie>()
                          .WithMany()
                          .HasForeignKey("MovieId")
                          .OnDelete(DeleteBehavior.Cascade),
                    j =>
                    {
                        j.HasKey("MovieId", "CastId");
                        j.ToTable("MovieCast");
                    });

            // --- Optional: giới hạn độ dài cột ---
            modelBuilder.Entity<Director>()
                .Property(d => d.Name)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<Movie>()
                .Property(m => m.Title)
                .HasMaxLength(200)
                .IsRequired();

            modelBuilder.Entity<Genre>()
                .Property(g => g.Name)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<Country>()
                .Property(c => c.Name)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<Language>()
                .Property(l => l.Name)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<Cast>()
                .Property(c => c.Name)
                .HasMaxLength(100)
                .IsRequired();
        }
    }
}
