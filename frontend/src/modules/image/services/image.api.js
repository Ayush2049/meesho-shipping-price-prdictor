import api from '@/services/axios.instance'

export const generateImages = async (formData) => {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('User not authenticated')
  }

  const response = await api.post('/generate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`, // ✅ THIS FIXES EVERYTHING
    },
  })

  return response.data
}
