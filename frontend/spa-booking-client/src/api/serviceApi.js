import axiosClient from "./axiosClient";

export const serviceApi = {
  getAll: () => axiosClient.get("services"),
  getAdvanced: () => axiosClient.get("services/advanced"), // endpoint test advanced
  getById: (id) => axiosClient.get(`services/${id}`),
  create: (data) => axiosClient.post("services", data),
  update: (id, data) => axiosClient.put(`services/${id}`, data),
  delete: (id) => axiosClient.delete(`services/${id}`),
};