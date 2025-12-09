using System.Net;
using SpaBooking.Application.Common.Exceptions;

namespace SpaBooking.API.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");

                context.Response.ContentType = "application/json";

                var (statusCode, code, message) = ex switch
                {
                    NotFoundException nf => (HttpStatusCode.NotFound, "NOT_FOUND", nf.Message),
                    UnauthorizedException un => (HttpStatusCode.Unauthorized, "UNAUTHORIZED", un.Message),
                    ConflictException cf => (HttpStatusCode.Conflict, "CONFLICT", cf.Message),

                    // FluentValidation
                    FluentValidation.ValidationException vEx => (HttpStatusCode.BadRequest, "VALIDATION_ERROR",
                        string.Join(" | ", vEx.Errors.Select(e => e.ErrorMessage))),

                    _ => (HttpStatusCode.InternalServerError, "INTERNAL_SERVER_ERROR",
                        "Đã xảy ra lỗi hệ thống.")
                };

                context.Response.StatusCode = (int)statusCode;

                await context.Response.WriteAsJsonAsync(new
                {
                    code,
                    message
                });
            }
        }
    }
}