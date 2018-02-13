using Microsoft.EntityFrameworkCore;
using Qantor.DataAccess.Models;

namespace Qantor.DataAccess
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<UserAccount> UserAccounts { get; set; }

        public DbSet<UserTransaction> UserTransactions { get; set; }

        public DbSet<ExchangeRate> ExchangeRates { get; set; }

        public DbSet<LoyaltyPoint> LoyaltyPoints { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ExchangeRate>().Property(p => p.PurchasePrice).HasColumnType("decimal(18, 4)");
            modelBuilder.Entity<ExchangeRate>().Property(p => p.SellPrice).HasColumnType("decimal(18, 4)");
        }
    }
}
