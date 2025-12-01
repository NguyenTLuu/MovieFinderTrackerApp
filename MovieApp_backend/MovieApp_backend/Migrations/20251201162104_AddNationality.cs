using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieApp_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNationality : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "Directors",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "Casts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Directors_CountryId",
                table: "Directors",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Casts_CountryId",
                table: "Casts",
                column: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Casts_Countries_CountryId",
                table: "Casts",
                column: "CountryId",
                principalTable: "Countries",
                principalColumn: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Directors_Countries_CountryId",
                table: "Directors",
                column: "CountryId",
                principalTable: "Countries",
                principalColumn: "CountryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Casts_Countries_CountryId",
                table: "Casts");

            migrationBuilder.DropForeignKey(
                name: "FK_Directors_Countries_CountryId",
                table: "Directors");

            migrationBuilder.DropIndex(
                name: "IX_Directors_CountryId",
                table: "Directors");

            migrationBuilder.DropIndex(
                name: "IX_Casts_CountryId",
                table: "Casts");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "Casts");
        }
    }
}
