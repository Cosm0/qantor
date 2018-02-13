using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Qantor.DataAccess.Migrations
{
    public partial class UniqueUserAccounts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "UX_UserAccount_UserId_Currency",
                table: "UserAccounts",
                columns: new[] { "Currency", "UserId" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UX_UserAccount_UserId_Currency",
                table: "UserAccounts");
        }
    }
}
