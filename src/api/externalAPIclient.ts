import axios, { AxiosInstance, AxiosResponse } from 'axios'

// API client for external api's like country details 
const externalApiClient: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

externalApiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    console.error('External API Error:', error)
    return Promise.reject(error)
  }
)

export default externalApiClient