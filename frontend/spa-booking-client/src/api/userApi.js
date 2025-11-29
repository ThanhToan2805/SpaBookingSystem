import axiosClient from "./axiosClient";

export const userApi = {
  getProfile: () => axiosClient.get("users/profile"),
  updateProfile: (data) => axiosClient.put("users/profile", data),
  getAll: () => axiosClient.get("users"),
  getById: (id) => axiosClient.get(`users/${id}`),
};