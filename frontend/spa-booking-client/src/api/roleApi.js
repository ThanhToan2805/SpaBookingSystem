import axiosClient from "./axiosClient";

export const roleApi = {
  getAll: () => axiosClient.get("roles"),
  getById: (id) => axiosClient.get(`roles/${id}`),
  create: (data) => axiosClient.post("roles", data),
  update: (id, data) => axiosClient.put(`roles/${id}`, data),
  delete: (id) => axiosClient.delete(`roles/${id}`),
};