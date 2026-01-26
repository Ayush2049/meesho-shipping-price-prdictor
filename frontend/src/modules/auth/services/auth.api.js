import axios from 'axios'

export const signup = (data) =>
  axios.post('/api/auth/signup', data)

export const verifyOtp = (data) =>
  axios.post('/api/auth/verify-otp', data)

export const login = (data) =>
  axios.post('/api/auth/login', data)
