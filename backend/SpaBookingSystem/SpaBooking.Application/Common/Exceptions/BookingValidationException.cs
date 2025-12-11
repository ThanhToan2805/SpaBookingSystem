using System;
using System.Collections.Generic;
using System.Linq;

namespace SpaBooking.Application.Common.Exceptions
{
    public class BookingValidationException : Exception
    {
        public IReadOnlyList<string> Errors { get; }

        public BookingValidationException(IEnumerable<string> errors)
            : base(string.Join("; ", errors))
        {
            Errors = errors.ToList().AsReadOnly();
        }

        public BookingValidationException(string error)
            : this(new List<string> { error })
        {
        }
    }
}