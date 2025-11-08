using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieApp_backend.Migrations
{
    /// <inheritdoc />
    public partial class RenameJoinTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieLanguage",
                table: "MovieLanguage");

            migrationBuilder.DropIndex(
                name: "IX_MovieLanguage_MovieId",
                table: "MovieLanguage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieGenre",
                table: "MovieGenre");

            migrationBuilder.DropIndex(
                name: "IX_MovieGenre_MovieId",
                table: "MovieGenre");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieCountry",
                table: "MovieCountry");

            migrationBuilder.DropIndex(
                name: "IX_MovieCountry_MovieId",
                table: "MovieCountry");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieCast",
                table: "MovieCast");

            migrationBuilder.DropIndex(
                name: "IX_MovieCast_MovieId",
                table: "MovieCast");

            migrationBuilder.DropColumn(
                name: "MoviesMovieId",
                table: "MovieLanguage");

            migrationBuilder.DropColumn(
                name: "MoviesMovieId",
                table: "MovieGenre");

            migrationBuilder.DropColumn(
                name: "MoviesMovieId",
                table: "MovieCountry");

            migrationBuilder.DropColumn(
                name: "MoviesMovieId",
                table: "MovieCast");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieLanguage",
                table: "MovieLanguage",
                columns: new[] { "MovieId", "LanguageId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieGenre",
                table: "MovieGenre",
                columns: new[] { "MovieId", "GenreId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieCountry",
                table: "MovieCountry",
                columns: new[] { "MovieId", "CountryId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieCast",
                table: "MovieCast",
                columns: new[] { "MovieId", "CastId" });

            migrationBuilder.CreateIndex(
                name: "IX_MovieLanguage_LanguageId",
                table: "MovieLanguage",
                column: "LanguageId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieGenre_GenreId",
                table: "MovieGenre",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieCountry_CountryId",
                table: "MovieCountry",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieCast_CastId",
                table: "MovieCast",
                column: "CastId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieLanguage",
                table: "MovieLanguage");

            migrationBuilder.DropIndex(
                name: "IX_MovieLanguage_LanguageId",
                table: "MovieLanguage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieGenre",
                table: "MovieGenre");

            migrationBuilder.DropIndex(
                name: "IX_MovieGenre_GenreId",
                table: "MovieGenre");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieCountry",
                table: "MovieCountry");

            migrationBuilder.DropIndex(
                name: "IX_MovieCountry_CountryId",
                table: "MovieCountry");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovieCast",
                table: "MovieCast");

            migrationBuilder.DropIndex(
                name: "IX_MovieCast_CastId",
                table: "MovieCast");

            migrationBuilder.AddColumn<int>(
                name: "MoviesMovieId",
                table: "MovieLanguage",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MoviesMovieId",
                table: "MovieGenre",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MoviesMovieId",
                table: "MovieCountry",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MoviesMovieId",
                table: "MovieCast",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieLanguage",
                table: "MovieLanguage",
                columns: new[] { "LanguageId", "MoviesMovieId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieGenre",
                table: "MovieGenre",
                columns: new[] { "GenreId", "MoviesMovieId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieCountry",
                table: "MovieCountry",
                columns: new[] { "CountryId", "MoviesMovieId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovieCast",
                table: "MovieCast",
                columns: new[] { "CastId", "MoviesMovieId" });

            migrationBuilder.CreateIndex(
                name: "IX_MovieLanguage_MovieId",
                table: "MovieLanguage",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieGenre_MovieId",
                table: "MovieGenre",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieCountry_MovieId",
                table: "MovieCountry",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieCast_MovieId",
                table: "MovieCast",
                column: "MovieId");
        }
    }
}
