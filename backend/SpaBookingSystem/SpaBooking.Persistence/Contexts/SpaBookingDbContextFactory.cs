using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SpaBooking.Persistence.Contexts
{
    public class SpaBookingDbContextFactory : IDesignTimeDbContextFactory<SpaBookingDbContext>
    {
        public SpaBookingDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<SpaBookingDbContext>();
            optionsBuilder.UseNpgsql("Host=localhost;Database=SpaBooking;Username=postgres;Password=12345");

            return new SpaBookingDbContext(optionsBuilder.Options);
        }
    }
}