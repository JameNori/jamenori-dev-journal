// Token management utilities
const TOKEN_KEY = "auth_token";

export const tokenUtils = {
  // เก็บ token ใน localStorage
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // ดึง token จาก localStorage
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // ลบ token จาก localStorage
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // เช็คว่ามี token หรือไม่
  hasToken: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
