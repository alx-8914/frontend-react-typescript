import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5089/api", // URL do seu backend
});

// Intercepta requisições para adicionar o token JWT
api.interceptors.request.use((config) => {
  console.log("Token sendo enviado:", localStorage.getItem("token")); // 👈 Novo log
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;