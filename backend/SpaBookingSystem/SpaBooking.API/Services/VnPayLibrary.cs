using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace SpaBooking.API.Services
{
    public class VnPayLibrary
    {
        private readonly SortedDictionary<string, string> _requestData = new();

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(key) && !string.IsNullOrEmpty(value))
            {
                _requestData[key] = value;
            }
        }

        public string CreateRequestUrl(string baseUrl, string hashSecret)
        {
            // 1. build query string
            var query = BuildQueryString(_requestData);
            // 2. hash theo HMAC-SHA512 với HashSecret
            var secureHash = HmacSHA512(hashSecret, query);
            // 3. append vnp_SecureHash vào URL
            return $"{baseUrl}?{query}&vnp_SecureHash={secureHash}";
        }

        public static bool ValidateSignature(IQueryCollection query, string hashSecret)
        {
            var vnpSecureHash = query["vnp_SecureHash"].ToString();
            if (string.IsNullOrEmpty(vnpSecureHash))
                return false;

            var data = new SortedDictionary<string, string>();
            foreach (var item in query)
            {
                var key = item.Key;
                if (key.StartsWith("vnp_") &&
                    key != "vnp_SecureHash" &&
                    key != "vnp_SecureHashType")
                {
                    data[key] = item.Value.ToString();
                }
            }

            var raw = BuildQueryString(data);
            var checkHash = HmacSHA512(hashSecret, raw);
            return checkHash.Equals(vnpSecureHash, StringComparison.OrdinalIgnoreCase);
        }

        private static string BuildQueryString(SortedDictionary<string, string> values)
        {
            var builder = new StringBuilder();
            foreach (var kv in values)
            {
                if (builder.Length > 0)
                    builder.Append('&');

                builder.Append(WebUtility.UrlEncode(kv.Key));
                builder.Append('=');
                builder.Append(WebUtility.UrlEncode(kv.Value));
            }
            return builder.ToString();
        }

        private static string HmacSHA512(string key, string data)
        {
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var dataBytes = Encoding.UTF8.GetBytes(data);
            using var hmac = new HMACSHA512(keyBytes);
            var hashBytes = hmac.ComputeHash(dataBytes);

            var sb = new StringBuilder(hashBytes.Length * 2);
            foreach (var b in hashBytes)
                sb.Append(b.ToString("x2"));

            return sb.ToString();
        }
    }
}