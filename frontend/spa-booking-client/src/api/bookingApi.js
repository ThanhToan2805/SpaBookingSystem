import axiosClient from "./axiosClient";

export const bookingApi = {
  getAll: () => axiosClient.get("bookings"),
  getById: (id) => axiosClient.get(`bookings/${id}`),
  create: (data) => axiosClient.post("bookings", data),

  // Thay đổi lịch (reschedule)
  reschedule: (id, data) => axiosClient.post(`bookings/${id}/reschedule`, data),

  // Hủy booking
  cancelBooking: (id, data) => axiosClient.post(`bookings/${id}/cancel`, data),

  update: (id, data) => axiosClient.put(`bookings/${id}`, data),
  delete: (id) => axiosClient.delete(`bookings/${id}`),

  // Các thao tác khác
  complete: (id, note) => axiosClient.post(`bookings/${id}/complete`, note),
  setNoShow: (id, note) => axiosClient.post(`bookings/${id}/noshow`, note),

  // Filter / calendar
  getByUser: (userId, params) => axiosClient.get(`bookings/user/${userId}`, { params }),
  getByDate: (params) => axiosClient.get("bookings/by-date", { params }),
  getCalendarView: (params) => axiosClient.get("bookings/calendar-view", { params }),

  getAvailableSlots: (params) =>
    axiosClient.get("/bookings/available-slots", {
      params, // { date, serviceId, staffId }
    }),
};