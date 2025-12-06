using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieApp_backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMovies_Users_UserId",
                table: "UserMovies");

            migrationBuilder.DropIndex(
                name: "IX_UserMovies_UserId",
                table: "UserMovies");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserMovies");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "UserMovies",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserMovies_UserId",
                table: "UserMovies",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMovies_Users_UserId",
                table: "UserMovies",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");
        }
    }
}
