using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieApp_backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRedundantUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMovies_Users_UserId",
                table: "UserMovies");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserMovies",
                table: "UserMovies");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "UserMovies",
                newName: "CustomListId");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "Users",
                type: "nvarchar(2048)",
                maxLength: 2048,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(2048)",
                oldMaxLength: 2048);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserMovies",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 450);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserMovies",
                table: "UserMovies",
                columns: new[] { "CustomListId", "MovieId" });

            migrationBuilder.CreateTable(
                name: "CustomLists",
                columns: table => new
                {
                    CustomListId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsSystemDefault = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomLists", x => x.CustomListId);
                    table.ForeignKey(
                        name: "FK_CustomLists_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Review",
                columns: table => new
                {
                    ReviewId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MovieId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Review", x => x.ReviewId);
                    table.ForeignKey(
                        name: "FK_Review_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Review_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserMovies_UserId",
                table: "UserMovies",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomLists_UserId",
                table: "CustomLists",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Review_MovieId",
                table: "Review",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_Review_UserId_MovieId",
                table: "Review",
                columns: new[] { "UserId", "MovieId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserMovies_CustomLists_CustomListId",
                table: "UserMovies",
                column: "CustomListId",
                principalTable: "CustomLists",
                principalColumn: "CustomListId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserMovies_Users_UserId",
                table: "UserMovies",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMovies_CustomLists_CustomListId",
                table: "UserMovies");

            migrationBuilder.DropForeignKey(
                name: "FK_UserMovies_Users_UserId",
                table: "UserMovies");

            migrationBuilder.DropTable(
                name: "CustomLists");

            migrationBuilder.DropTable(
                name: "Review");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserMovies",
                table: "UserMovies");

            migrationBuilder.DropIndex(
                name: "IX_UserMovies_UserId",
                table: "UserMovies");

            migrationBuilder.RenameColumn(
                name: "CustomListId",
                table: "UserMovies",
                newName: "Type");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Users",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "Users",
                type: "nvarchar(2048)",
                maxLength: 2048,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(2048)",
                oldMaxLength: 2048,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserMovies",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserMovies",
                table: "UserMovies",
                columns: new[] { "UserId", "MovieId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserMovies_Users_UserId",
                table: "UserMovies",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
