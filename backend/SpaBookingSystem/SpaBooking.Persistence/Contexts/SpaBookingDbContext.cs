using Microsoft.EntityFrameworkCore;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Persistence.Contexts
{
    public class SpaBookingDbContext : DbContext
    {
        public SpaBookingDbContext(DbContextOptions<SpaBookingDbContext> options)
            : base(options) { }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<TimeSlot> TimeSlots { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Example: cấu hình Role.Name required + length
            modelBuilder.Entity<Role>(b =>
            {
                b.HasKey(r => r.Id);
                b.Property(r => r.Name).IsRequired().HasMaxLength(50);
            });

            modelBuilder.Entity<User>(b =>
            {
                b.HasKey(u => u.Id);
                b.Property(u => u.Username).IsRequired().HasMaxLength(100);
                b.Property(u => u.Email).IsRequired().HasMaxLength(200);
                b.HasOne(u => u.Role).WithMany(r => r.Users).HasForeignKey(u => u.RoleId);
            });

            modelBuilder.Entity<Service>(b =>
            {
                b.HasKey(s => s.Id);
                b.Property(s => s.Name).IsRequired().HasMaxLength(200);
                b.Property(s => s.Price).HasColumnType("numeric(12,2)");
                b.HasOne(s => s.Category)
                 .WithMany(c => c.Services)
                 .HasForeignKey(s => s.CategoryId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Booking>(b =>
            {
                b.HasKey(x => x.Id);
                b.HasOne(x => x.Service).WithMany().HasForeignKey(x => x.ServiceId);
                b.HasOne(x => x.Customer).WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Restrict);
                b.HasOne(x => x.Staff).WithMany().HasForeignKey(x => x.StaffId).OnDelete(DeleteBehavior.SetNull);
                b.Property(x => x.Status).HasConversion<string>().HasMaxLength(50);
            });

            // Additional indexes
            modelBuilder.Entity<Booking>().HasIndex(b => new { b.StartAt, b.StaffId });
        }
    }
}