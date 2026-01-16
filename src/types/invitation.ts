export interface Invitation {
  id: string
  email: string
  role: string
  expires_at: string
  accepted_at: string | null
  status: 'pending' | 'accepted' | 'expired'
  created_at: string
  invited_by_id?: string
}

export interface InvitationFilters {
  page?: number
  per_page?: number
}
