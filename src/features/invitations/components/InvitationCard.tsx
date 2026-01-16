import type { Invitation } from '@/types'

interface InvitationCardProps {
  invitation: Invitation
  onDelete?: () => void
  isDeleting?: boolean
}

export function InvitationCard({ invitation, onDelete, isDeleting }: InvitationCardProps) {
  const isPending = invitation.status === 'pending'
  const isAccepted = invitation.status === 'accepted'
  const isExpired = invitation.status === 'expired'

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    expired: 'bg-gray-100 text-gray-800',
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{invitation.email}</h3>
          <p className="text-sm text-gray-500 capitalize mt-1">{invitation.role}</p>
        </div>
        <span className={`ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${statusStyles[invitation.status]}`}>
          {invitation.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Created</span>
          <span className="text-gray-900">{formatDate(invitation.created_at)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Expires</span>
          <span className={isExpired ? 'text-red-600 font-medium' : 'text-gray-900'}>
            {formatDateTime(invitation.expires_at)}
          </span>
        </div>
        {isAccepted && invitation.accepted_at && (
          <div className="flex justify-between">
            <span className="text-gray-500">Accepted</span>
            <span className="text-gray-900">{formatDateTime(invitation.accepted_at)}</span>
          </div>
        )}
      </div>

      {isPending && onDelete && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onDelete}
            disabled={isDeleting}
            aria-label={`Delete invitation for ${invitation.email}`}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete Invitation'}
          </button>
        </div>
      )}
    </div>
  )
}
