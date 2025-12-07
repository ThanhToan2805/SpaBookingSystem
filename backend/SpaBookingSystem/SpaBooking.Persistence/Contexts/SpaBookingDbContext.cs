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
        public DbSet<Category> Categories { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<TimeSlot> TimeSlots { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // -----------------------
            // Role
            // -----------------------
            modelBuilder.Entity<Role>(b =>
            {
                b.HasKey(r => r.Id);
                b.Property(r => r.Name).IsRequired().HasMaxLength(50);
                b.Property(r => r.Description).HasMaxLength(200);
            });

            // -----------------------
            // User
            // -----------------------
            modelBuilder.Entity<User>(b =>
            {
                b.HasKey(u => u.Id);
                b.Property(u => u.Username).IsRequired().HasMaxLength(100);
                b.Property(u => u.Email).IsRequired().HasMaxLength(200);
                b.Property(u => u.PasswordHash).IsRequired();
                b.HasOne(u => u.Role)
                 .WithMany(r => r.Users)
                 .HasForeignKey(u => u.RoleId)
                 .OnDelete(DeleteBehavior.Restrict);

                // Unique constraints
                b.HasIndex(u => u.Username).IsUnique();
                b.HasIndex(u => u.Email).IsUnique();
            });

            // -----------------------
            // Category
            // -----------------------
            modelBuilder.Entity<Category>(b =>
            {
                b.HasKey(c => c.Id);
                b.Property(c => c.Name).IsRequired().HasMaxLength(100);
                b.Property(c => c.Description).HasMaxLength(500);
            });

            // -----------------------
            // Service
            // -----------------------
            modelBuilder.Entity<Service>(b =>
            {
                b.HasKey(s => s.Id);
                b.Property(s => s.Name).IsRequired().HasMaxLength(200);
                b.Property(s => s.Price).HasColumnType("numeric(12,2)");
                b.Property(s => s.DurationMinutes).IsRequired();
                b.Property(s => s.ImageUrl).HasMaxLength(500);
                b.HasOne(s => s.Category)
                 .WithMany(c => c.Services)
                 .HasForeignKey(s => s.CategoryId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // -----------------------
            // Staff
            // -----------------------
            modelBuilder.Entity<Staff>(b =>
            {
                b.HasKey(s => s.Id);
                b.Property(s => s.Position).IsRequired().HasMaxLength(100);
                b.Property(s => s.IsAvailable).IsRequired();

                b.HasOne(s => s.User)
                 .WithOne(u => u.StaffProfile)
                 .HasForeignKey<Staff>(s => s.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(s => s.UserId).IsUnique(); // 1-1 User-Staff
            });

            // -----------------------
            // TimeSlot
            // -----------------------
            modelBuilder.Entity<TimeSlot>(b =>
            {
                b.HasKey(t => t.Id);
                b.Property(t => t.StartAt).IsRequired();
                b.Property(t => t.EndAt).IsRequired();
                b.Property(t => t.IsAvailable).IsRequired();

                b.HasOne(t => t.Staff)
                 .WithMany(s => s.TimeSlots)
                 .HasForeignKey(t => t.StaffId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(t => t.Booking)
                 .WithMany(bk => bk.TimeSlots)
                 .HasForeignKey(t => t.BookingId)
                 .OnDelete(DeleteBehavior.SetNull);

                // Unique constraint để tránh trùng slot
                b.HasIndex(t => new { t.StaffId, t.StartAt, t.EndAt }).IsUnique();
            });

            // -----------------------
            // Promotion
            // -----------------------
            modelBuilder.Entity<Promotion>(b =>
            {
                b.HasKey(p => p.Id);
                b.Property(p => p.Name).IsRequired().HasMaxLength(200);
                b.Property(p => p.IsActive).IsRequired();

                // Relationship với Booking
                b.HasMany(p => p.Bookings)
                 .WithOne(bk => bk.Promotion)
                 .HasForeignKey(bk => bk.PromotionId)
                 .OnDelete(DeleteBehavior.SetNull);
            });

            // -----------------------
            // Booking
            // -----------------------
            modelBuilder.Entity<Booking>(b =>
            {
                b.HasKey(bk => bk.Id);
                b.Property(bk => bk.StartAt).IsRequired();
                b.Property(bk => bk.EndAt).IsRequired();
                b.Property(bk => bk.Status).HasConversion<string>().HasMaxLength(50);
                b.Property(bk => bk.Note).HasMaxLength(500);

                b.Property(bk => bk.FinalPrice)
                 .HasColumnType("numeric(12,2)")
                 .IsRequired();

                b.HasOne(bk => bk.Promotion)
                 .WithMany(p => p.Bookings)
                 .HasForeignKey(bk => bk.PromotionId)
                 .OnDelete(DeleteBehavior.SetNull);

                b.HasOne(bk => bk.Customer)
                 .WithMany(u => u.Bookings)
                 .HasForeignKey(bk => bk.CustomerId)
                 .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(bk => bk.Service)
                 .WithMany()
                 .HasForeignKey(bk => bk.ServiceId)
                 .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(bk => bk.Staff)
                 .WithMany(s => s.Bookings)
                 .HasForeignKey(bk => bk.StaffId)
                 .OnDelete(DeleteBehavior.SetNull);

                // Index hỗ trợ kiểm tra overlap
                b.HasIndex(bk => new { bk.StartAt, bk.StaffId });

                // Check constraint: EndAt > StartAt
                b.ToTable(tb =>
                {
                    tb.HasCheckConstraint("CK_Booking_EndAt", "\"EndAt\" > \"StartAt\"");
                });
            });

            // -----------------------
            // Payment
            // -----------------------
            modelBuilder.Entity<Payment>(b =>
            {
                b.HasKey(p => p.Id);
                b.Property(p => p.Amount).HasColumnType("numeric(12,2)").IsRequired();
                b.Property(p => p.PaymentMethod).IsRequired().HasMaxLength(50);
                b.Property(p => p.Status).HasConversion<string>().HasMaxLength(50).IsRequired();
                b.Property(p => p.PaidAt).IsRequired(false);
                b.Property(p => p.CreatedAt).IsRequired();
                b.Property(p => p.InvoiceCode).IsRequired().HasMaxLength(50);
                b.Property(p => p.TransactionCode).HasMaxLength(100);

                b.HasIndex(p => p.InvoiceCode).IsUnique();

                b.HasOne(p => p.Booking)
                 .WithMany(bk => bk.Payments)
                 .HasForeignKey(p => p.BookingId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // ---- PasswordResetToken ----
            modelBuilder.Entity<PasswordResetToken>(b =>
            {
                b.HasKey(t => t.Id);

                b.Property(t => t.Token).IsRequired().HasMaxLength(200);
                b.Property(t => t.Expiration).IsRequired();
                b.Property(t => t.IsUsed).IsRequired();
                b.Property(t => t.CreatedAt).IsRequired();

                b.HasOne(t => t.User)
                 .WithMany(u => u.PasswordResetTokens)
                 .HasForeignKey(t => t.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(t => t.Token).IsUnique(); // đảm bảo token duy nhất
            });
        }
    }
}