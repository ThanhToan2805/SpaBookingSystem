import axiosClient from "./axiosClient";

export const staffApi = {
  // GET: api/staffs
  getAll: (params) => axiosClient.get("staffs", { params }),

  // GET: api/staffs/{id}
  getById: (id) => axiosClient.get(`staffs/${id}`),

  // POST: api/staffs
  // body: { userId, position, isAvailable }
  create: (data) => axiosClient.post("staffs", data),

  // PUT: api/staffs/{id}
  // body: { id, position, isAvailable }
  update: (id, data) =>
    axiosClient.put(`staffs/${id}`, { ...data, id }),

  // DELETE: api/staffs/{id}
  delete: (id) => axiosClient.delete(`staffs/${id}`),

  // GET: api/staffs/position?position=Therapist
  getByPosition: (position) =>
    axiosClient.get("staffs/position", { params: { position } }),

  // GET: api/staffs/{staffId}/schedule?date=2025-12-01
  getSchedule: (staffId, date) =>
    axiosClient.get(`staffs/${staffId}/schedule`, {
      params: { date },
    }),

  // GET: api/staffs/{staffId}/bookings?from=...&to=...&status=...
  getBookings: (staffId, { from, to, status } = {}) =>
    axiosClient.get(`staffs/${staffId}/bookings`, {
      params: { from, to, status },
    }),

  // GET: api/staffs/{staffId}/working-hours?from=...&to=...
  getWorkingHours: (staffId, { from, to } = {}) =>
    axiosClient.get(`staffs/${staffId}/working-hours`, {
      params: { from, to },
    }),

  // PUT: api/staffs/{staffId}/working-hours
  updateWorkingHours: (staffId, data) =>
    axiosClient.put(`staffs/${staffId}/working-hours`, {
      ...data,
      staffId,
    }),

  // GET: api/staffs/available?position=...&startAt=...&endAt=...
  // findAvailable: ({ position, startAt, endAt }) =>
  //   axiosClient.get("staffs/available", {
  //     params: { position, startAt, endAt },
  //   }),
  getAvailableStaff: (params) =>
    axiosClient.get("staffs/available", { params }),

  // GET: api/staffs/{staffId}/check-availability?startAt=...&endAt=...
  checkAvailability: (staffId, { startAt, endAt }) =>
    axiosClient.get(`staffs/${staffId}/check-availability`, {
      params: { startAt, endAt },
    }),

  // GET: api/staffs/{staffId}/utilization?from=...&to=...
  getUtilization: (staffId, { from, to } = {}) =>
    axiosClient.get(`staffs/${staffId}/utilization`, {
      params: { from, to },
    }),

  // PUT: api/staffs/{staffId}/toggle-availability
  // body: ToggleAvailabilityCommand (auto nhét StaffId)
  toggleAvailability: (staffId, data = {}) =>
    axiosClient.put(`staffs/${staffId}/toggle-availability`, {
      ...data,
      staffId,
    }),
};