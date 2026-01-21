import api from '@/services/axios.instance'

export const generateImages = async (formData) => {
  const response = await api.post('/generate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}
