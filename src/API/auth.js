import { api } from "./api";

export const LoginUser = (email, password) => api.post("/auth/login", { email, password });
export const RegisterUser = (data, isFormData = false) => api.post("/auth/register", data, isFormData);