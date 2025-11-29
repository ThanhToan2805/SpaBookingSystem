import axiosClient from "./axiosClient";

export const staffApi = {
  getAll: () => axiosClient.get("staffs"),
  getById: (id) => axiosClient.get(`staffs/${id}`),
  create: (data) => axiosClient.post("staffs", data),
  update: (id, data) => axiosClient.put(`staffs/${id}`, data),
  delete: (id) => axiosClient.delete(`staffs/${id}`),
};