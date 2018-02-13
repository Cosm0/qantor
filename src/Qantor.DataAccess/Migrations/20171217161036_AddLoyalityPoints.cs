using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Qantor.DataAccess.Migrations
{
    public partial class AddLoyaltyPoints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ArePointsActive",
                table: "UserTransactions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Points",
                table: "UserTransactions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "LoyaltyPoints",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    LowerRange = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    UpperRange = table.Column<decimal>(type: "decimal(18, 2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoyaltyPoints", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoyaltyPoints");

            migrationBuilder.DropColumn(
                name: "ArePointsActive",
                table: "UserTransactions");

            migrationBuilder.DropColumn(
                name: "Points",
                table: "UserTransactions");
        }
    }
}
