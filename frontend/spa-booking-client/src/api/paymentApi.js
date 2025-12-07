import axiosClient from "./axiosClient";

export const paymentApi = {
  // Tạo payment
  create: (data) => axiosClient.post("payments", data),

  // Lấy tất cả payment
  getAll: () => axiosClient.get("payments"),

  // Lấy payment theo ID
  getById: (id) => axiosClient.get(`payments/${id}`),

  // Xóa payment
  delete: (id) => axiosClient.delete(`payments/${id}`),

  // Confirm cash payment
  confirmCash: (id) => axiosClient.post(`payments/${id}/confirm-cash`),

  // Lấy payment theo booking
  getByBooking: (bookingId) => axiosClient.get(`payments/by-booking/${bookingId}`),

  // Lấy payment theo status
  getByStatus: (status) => axiosClient.get(`payments/status/${status}`),

  // Tạo URL thanh toán VNPay
  createVnPayUrl: (id) => axiosClient.post(`payments/${id}/vnpay-url`),
};