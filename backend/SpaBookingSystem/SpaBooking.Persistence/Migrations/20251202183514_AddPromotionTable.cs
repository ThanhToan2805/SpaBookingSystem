using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpaBooking.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPromotionTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "FinalPrice",
                table: "Bookings",
                type: "numeric(12,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "PromotionId",
                table: "Bookings",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Promotions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DiscountAmount = table.Column<decimal>(type: "numeric", nullable: true),
                    DiscountPercent = table.Column<decimal>(type: "numeric", nullable: false),
                    StartAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Promotions", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_PromotionId",
                table: "Bookings",
                column: "PromotionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Promotions_PromotionId",
                table: "Bookings",
                column: "PromotionId",
                principalTable: "Promotions",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Promotions_PromotionId",
                table: "Bookings");

            migrationBuilder.DropTable(
                name: "Promotions");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_PromotionId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "FinalPrice",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PromotionId",
                table: "Bookings");
        }
    }
}
