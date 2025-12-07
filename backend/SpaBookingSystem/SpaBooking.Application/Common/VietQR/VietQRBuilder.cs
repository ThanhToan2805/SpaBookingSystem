namespace SpaBooking.Application.Common.VietQR
{
    public static class VietQRBuilder
    {
        public static string BuildVietQRContent(string bankCode, string accountNumber, string accountName, decimal amount, string addInfo)
        {
            // amount = 0 => VietQR sẽ hiểu là chuyển tiền thủ công, không bị trừ tiền
            string amt = amount > 0 ? amount.ToString("0") : "";

            string qr = $"000201" + // Message ID
                        "010212" + // Version
                        "38540010A000000727" + // Domain VietQR
                        "01" + bankCode.Length.ToString("00") + bankCode + // Bank
                        "02" + accountNumber.Length.ToString("00") + accountNumber + // Account
                        "5303704" + // Currency VND
                        "54" + amt.Length.ToString("00") + amt + // Amount
                        "58" + addInfo.Length.ToString("00") + addInfo + // Description
                        "6304"; // Checksum placeholder

            return qr;
        }
    }
}