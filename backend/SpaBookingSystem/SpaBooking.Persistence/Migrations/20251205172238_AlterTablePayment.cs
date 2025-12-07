using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpaBooking.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AlterTablePayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InvoiceCode",
                table: "Payments",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TransactionCode",
                table: "Payments",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_InvoiceCode",
                table: "Payments",
                column: "InvoiceCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Payments_InvoiceCode",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "InvoiceCode",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "TransactionCode",
                table: "Payments");
        }
    }
}
