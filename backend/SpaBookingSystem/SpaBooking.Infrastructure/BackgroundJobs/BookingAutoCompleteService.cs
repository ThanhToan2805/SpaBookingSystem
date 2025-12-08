using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Infrastructure.BackgroundJobs
{
    public class BookingAutoCompleteService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<BookingAutoCompleteService> _logger;

        public BookingAutoCompleteService(
            IServiceProvider serviceProvider,
            ILogger<BookingAutoCompleteService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("BookingAutoCompleteService started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // mỗi 1 phút check một lần
                    await ProcessBookingsAsync(stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    // app shutdown
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error while auto-completing bookings.");
                }
            }

            _logger.LogInformation("BookingAutoCompleteService stopped.");
        }

        private async Task ProcessBookingsAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var bookingRepo = scope.ServiceProvider.GetRequiredService<IBookingRepository>();

            var nowUtc = DateTime.UtcNow.AddMinutes(-5);

            // Lấy các booking đã hết giờ mà vẫn đang Confirmed
            var bookings = await bookingRepo.Query()
                .Where(b =>
                    (b.Status == BookingStatus.Confirmed) &&
                    b.EndAt <= nowUtc)
                .ToListAsync(cancellationToken);

            if (!bookings.Any()) return;

            _logger.LogInformation("Auto-completing {Count} bookings.", bookings.Count);

            foreach (var booking in bookings)
            {
                booking.Status = BookingStatus.Completed;
                await bookingRepo.UpdateAsync(booking);
            }
        }
    }
}