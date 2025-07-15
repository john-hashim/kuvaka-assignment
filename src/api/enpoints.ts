// src/api/endpoints.ts
export const ENDPOINTS = {
  AUTH: {
    COUNTRY_DATA: 'https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2',
  },
} as const

export type EndpointValues = typeof ENDPOINTS
