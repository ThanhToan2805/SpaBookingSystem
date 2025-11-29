import axiosClient from "./axiosClient";

export const bookingApi = {
  getAll: () => axiosClient.get("booking"),
  getById: (id) => axiosClient.get(`booking/${id}`),
  create: (data) => axiosClient.post("booking", data),
  update: (id, data) => axiosClient.put(`booking/${id}`, data),
  delete: (id) => axiosClient.delete(`booking/${id}`),
};