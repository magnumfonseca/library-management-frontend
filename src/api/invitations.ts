import api from './client'
import type { Invitation, InvitationFilters, JsonApiResponse, PaginationMeta, ApiPaginationMeta } from '@/types'

type InvitationAttributes = Omit<Invitation, 'id'>

interface InvitationsApiResponse {
  data: JsonApiResponse<InvitationAttributes>['data']
  meta?: ApiPaginationMeta
}

interface InvitationsResponse {
  data: Invitation[]
  meta: PaginationMeta
}

export async function getInvitations(filters: InvitationFilters = {}): Promise<InvitationsResponse> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null)
  )

  const response = await api.get<InvitationsApiResponse>('/api/v1/invitations', { params })

  const invitations = Array.isArray(response.data.data)
    ? response.data.data.map((item) => ({ id: item.id, ...item.attributes }))
    : [{ id: response.data.data.id, ...response.data.data.attributes }]

  const page = response.data.meta?.page

  return {
    data: invitations,
    meta: {
      current_page: page?.number || 1,
      total_pages: page?.totalPages || 1,
      total_count: page?.total || invitations.length,
      per_page: page?.size || 25,
    },
  }
}

export async function createInvitation(email: string): Promise<Invitation> {
  const response = await api.post<JsonApiResponse<InvitationAttributes>>('/api/v1/invitations', {
    invitation: { email },
  })

  if (Array.isArray(response.data.data)) {
    throw new Error('Unexpected array response')
  }

  return { id: response.data.data.id, ...response.data.data.attributes }
}

export async function deleteInvitation(invitationId: string): Promise<void> {
  await api.delete(`/api/v1/invitations/${invitationId}`)
}

export async function getInvitationByToken(token: string): Promise<Invitation> {
  const response = await api.get<JsonApiResponse<InvitationAttributes>>(`/api/v1/invitations/token/${token}`)

  if (Array.isArray(response.data.data)) {
    throw new Error('Unexpected array response')
  }

  return { id: response.data.data.id, ...response.data.data.attributes }
}

export interface AcceptInvitationData {
  name: string
  password: string
  password_confirmation: string
}

export async function acceptInvitation(token: string, userData: AcceptInvitationData): Promise<void> {
  await api.patch(`/api/v1/invitations/token/${token}/accept`, {
    user: userData,
  })
}
