import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, // 환경 변수로 API URL 설정
  withCredentials: true,
});

// 요청에 JWT 토큰을 자동으로 추가하는 인터셉터 설정
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 토큰을 로컬 스토리지에서 가져옴
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
