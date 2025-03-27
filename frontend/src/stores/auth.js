import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken') || null,
  }),

  actions: {
    async login(email, password) {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      this.token = response.data.token;
      this.user = response.data.user;
      localStorage.setItem('authToken', this.token);
    },

    async register(name, email, password) {
      const response = await axios.post('http://localhost:3000/api/auth/register', { name, email, password });
      this.token = response.data.token;
      this.user = response.data.user;
      localStorage.setItem('authToken', this.token);
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('authToken');
    },

    async fetchUser() {
      if (this.token) {
        try {
          const response = await axios.get('http://localhost:3000/api/auth/me', {
            headers: { Authorization: `Bearer ${this.token}` },
          });
          this.user = response.data;
        } catch (error) {
          console.error('Failed to fetch user:', error);
          this.logout();
        }
      }
    },
  },
});

// Automatically attach the token to all axios requests
axios.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});
