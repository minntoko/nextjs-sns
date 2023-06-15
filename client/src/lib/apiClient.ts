import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:8000/api',
  headers: {
    "Content-Type": "application/json"
  }
});

export default apiClient;