import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getInvitations, createInvitation, deleteInvitation } from '@/api/invitations'
import { InvitationCard } from './InvitationCard'
import { InvitationForm } from './InvitationForm'
import { Pagination, Toast, Modal } from '@/components/ui'
import type { InvitationFilters } from '@/types'

export function InvitationList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [deletingInvitationId, setDeletingInvitationId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const queryClient = useQueryClient()

  const filters: InvitationFilters = {
    page: Number(searchParams.get('page')) || 1,
    per_page: 12,
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['invitations', filters],
    queryFn: () => getInvitations(filters),
  })

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('page', String(page))
    } else {
      params.delete('page')
    }
    setSearchParams(params)
  }

  const createMutation = useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      setIsFormOpen(false)
      setToast({ message: 'Invitation sent successfully', type: 'success' })
    },
    onError: () => {
      setToast({ message: 'Failed to send invitation', type: 'error' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      setDeletingInvitationId(null)
      setToast({ message: 'Invitation deleted successfully', type: 'success' })
    },
    onError: () => {
      setDeletingInvitationId(null)
      setToast({ message: 'Failed to delete invitation', type: 'error' })
    },
  })

  const handleCreate = (data: { email: string }) => {
    if (createMutation.isPending) return
    createMutation.mutate(data.email)
  }

  const handleDelete = (invitationId: string) => {
    if (deleteMutation.isPending) return
    setDeletingInvitationId(invitationId)
    deleteMutation.mutate(invitationId)
  }

  if (isLoading) {
    return <InvitationListSkeleton />
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">Failed to load invitations. Please try again.</p>
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

  const invitations = data?.data || []
  const meta = data?.meta

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invitations</h1>
          <p className="text-gray-500">
            {meta?.total_count || 0} invitation{meta?.total_count !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Send Invitation
        </button>
      </div>

      {invitations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No invitations yet</h3>
          <p className="text-gray-500">
            Send an invitation to invite a librarian to join the system.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onDelete={() => handleDelete(invitation.id)}
                isDeleting={deletingInvitationId === invitation.id}
              />
            ))}
          </div>

          {meta && meta.total_pages > 1 && (
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.total_pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Send Invitation"
      >
        <InvitationForm
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={createMutation.isPending}
        />
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

function InvitationListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-3">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-4" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
