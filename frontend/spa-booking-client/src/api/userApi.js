import axiosClient from "./axiosClient";

export const userApi = {
  getProfile: () => axiosClient.get("users/profile"),
  updateProfile: (data) => axiosClient.put("users/profile", data),

  getAll: () => axiosClient.get("users"),

  // Admin create user
  create: (data) => axiosClient.post("users", data),

  // Admin delete user
  delete: (id) => axiosClient.delete(`users/${id}`),
};