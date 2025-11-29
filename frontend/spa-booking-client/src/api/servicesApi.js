// src/api/servicesApi.js
import axiosClient from "./axiosClient";

export const servicesApi = {
  getAll: () => axiosClient.get("/services"),
  getById: (id) => axiosClient.get(`/services/${id}`),
};