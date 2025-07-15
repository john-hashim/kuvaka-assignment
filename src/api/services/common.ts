import { AxiosResponse } from 'axios'
import externalApiClient from '../externalAPIclient'
import { ENDPOINTS } from '../enpoints'
import { Country } from '@/types/common'

export const commonService = {
  /**
   * get country data with email and password
   * @returns Promise with country data
   */
  getCountryData: (): Promise<AxiosResponse<Country[]>> => {
    return externalApiClient.get(ENDPOINTS.AUTH.COUNTRY_DATA)
  },
}