using CloudinaryDotNet;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SpaBooking.Application.Interfaces.Notifications;
using SpaBooking.Application.Interfaces.Services;
using SpaBooking.Infrastructure.BackgroundJobs;
using SpaBooking.Infrastructure.Services;
using SpaBooking.Infrastructure.SignalR;

namespace SpaBooking.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            var cloudName = config["Cloudinary:CloudName"];
            var apiKey = config["Cloudinary:ApiKey"];
            var apiSecret = config["Cloudinary:ApiSecret"];

            var account = new Account(cloudName, apiKey, apiSecret);
            var cloudinary = new Cloudinary(account);

            services.AddSingleton(cloudinary);
            services.AddScoped<ICloudinaryService, CloudinaryService>();

            services.AddScoped<IBookingNotificationService, SignalRBookingNotificationService>();

            services.AddHostedService<BookingAutoCompleteService>();

            return services;
        }
    }
}