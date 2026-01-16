import api from './client'
import type { DashboardData, DashboardFilters } from '@/types'

interface DashboardApiResponse {
  data: DashboardData
}

export async function getDashboard(filters: DashboardFilters = {}): Promise<DashboardData> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null)
  )

  const response = await api.get<DashboardApiResponse>('/api/v1/dashboard', { params })

  return response.data.data
}
