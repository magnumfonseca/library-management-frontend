import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '@/api/dashboard'
import { useAuthStore } from '@/store/authStore'
import { LibrarianDashboard } from './LibrarianDashboard'
import { MemberDashboard } from './MemberDashboard'
import { isLibrarianDashboardData, isMemberDashboardData } from '@/types'
import type { DashboardFilters } from '@/types'

export function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const [searchParams] = useSearchParams()
  const isLibrarian = user?.role === 'librarian'

  const filters: DashboardFilters = {
    page: Number(searchParams.get('page')) || 1,
    per_page: isLibrarian ? 10 : 20,
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', filters],
    queryFn: () => getDashboard(filters),
  })

  if (isLoading) {
    return <DashboardSkeleton isLibrarian={isLibrarian} />
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}!</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Guard against undefined data
  if (!data) {
    return <DashboardSkeleton isLibrarian={isLibrarian} />
  }

  // Validate dashboard data type matches expected role
  if (isLibrarian && !isLibrarianDashboardData(data)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}!</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">Unexpected dashboard data format. Please contact support.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isLibrarian && !isMemberDashboardData(data)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}!</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">Unexpected dashboard data format. Please contact support.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
      </div>

      {isLibrarianDashboardData(data) ? (
        <LibrarianDashboard data={data} />
      ) : (
        <MemberDashboard data={data} />
      )}
    </div>
  )
}

interface DashboardSkeletonProps {
  isLibrarian: boolean
}

function DashboardSkeleton({ isLibrarian }: DashboardSkeletonProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mt-2" />
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${isLibrarian ? 'lg:grid-cols-3' : ''} gap-4`}>
        {Array.from({ length: isLibrarian ? 3 : 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
