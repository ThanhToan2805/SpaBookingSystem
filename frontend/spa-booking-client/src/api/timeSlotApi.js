import axiosClient from "./axiosClient";

export const timeSlotApi = {
  getAll: () => axiosClient.get("timeslots"),
  create: (data) => axiosClient.post("timeslots", data),
  update: (id, data) => axiosClient.put(`timeslots/${id}`, data),
  delete: (id) => axiosClient.delete(`timeslots/${id}`),
};