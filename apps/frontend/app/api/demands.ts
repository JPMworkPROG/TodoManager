import config from '@/lib/loadEnv'

export type DemandStatus = 'planning' | 'in_progress' | 'completed'

export type DemandItem = {
  sku: number
  description: string
  plannedTotalTons: number
  producedTotalTons: number | null
}

export type Demand = {
  id: string
  title: string
  status: DemandStatus
  items: DemandItem[]
  startDate: string
  endDate: string
  prodTotalTons: number
  description: string
}

export type PaginationMeta = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type PaginatedDemandsResponse = {
  data: Demand[]
  meta: PaginationMeta
}

export type DemandItemInput = {
  description: string
  plannedTotalTons: number
}

export type CreateDemandPayload = {
  title: string
  description: string
  status: DemandStatus
  startDate: string
  endDate: string
  items: DemandItemInput[]
}

export type UpdateDemandPayload = {
  title: string
  description: string
  status: DemandStatus
  startDate: string
  endDate: string
}

export type DemandItemCreatePayload = {
  description: string
  plannedTotalTons: number
  producedTotalTons?: number
}

export type DemandItemUpdatePayload = {
  description?: string
  plannedTotalTons?: number
  producedTotalTons?: number
}

export const fetchDemands = async (
  page: number,
  pageSize: number,
): Promise<PaginatedDemandsResponse> => {
  const response = await fetch(
    `${config.API_BASE_URL}/demands?page=${page}&pageSize=${pageSize}`,
  )

  if (!response.ok) {
    throw new Error(`Erro ao buscar demandas: ${response.statusText}`)
  }

  const result = await response.json()
  return {
    data: result.data || [],
    meta: result.meta || {
      page: 1,
      pageSize: 20,
      totalItems: 0,
      totalPages: 0,
    },
  }
}

export const createDemand = async (
  payload: CreateDemandPayload,
): Promise<Demand> => {
  const response = await fetch(`${config.API_BASE_URL}/demands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }))
    throw new Error(
      error.message || `Erro ao criar demanda: ${response.statusText}`,
    )
  }

  const result = await response.json()
  return result
}

export const fetchDemand = async (demandId: string): Promise<Demand> => {
  const response = await fetch(`${config.API_BASE_URL}/demands/${demandId}`)

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }))
    throw new Error(
      error.message || `Erro ao buscar demanda: ${response.statusText}`,
    )
  }

  const result = await response.json()
  return result
}

export const updateDemand = async (
  demandId: string,
  payload: UpdateDemandPayload,
): Promise<Demand> => {
  const response = await fetch(`${config.API_BASE_URL}/demands/${demandId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }))
    throw new Error(
      error.message || `Erro ao atualizar demanda: ${response.statusText}`,
    )
  }

  const result = await response.json()
  return result
}

export const createDemandItem = async (
  demandId: string,
  payload: DemandItemCreatePayload,
): Promise<DemandItem> => {
  const response = await fetch(
    `${config.API_BASE_URL}/demands/${demandId}/items`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }))
    throw new Error(
      error.message || `Erro ao criar item: ${response.statusText}`,
    )
  }

  const result = await response.json()
  return result
}

export const updateDemandItem = async (
  demandId: string,
  itemId: number,
  payload: DemandItemUpdatePayload,
): Promise<DemandItem> => {
  const response = await fetch(
    `${config.API_BASE_URL}/demands/${demandId}/items/${itemId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }))
    throw new Error(
      error.message || `Erro ao atualizar item: ${response.statusText}`,
    )
  }

  const result = await response.json()
  return result
}

export const deleteDemand = async (demandId: string): Promise<void> => {
  const response = await fetch(`${config.API_BASE_URL}/demands/${demandId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }))
    throw new Error(
      error.message || `Erro ao deletar demanda: ${response.statusText}`,
    )
  }
}

export const deleteDemandItem = async (
  demandId: string,
  itemId: number,
): Promise<void> => {
  const response = await fetch(
    `${config.API_BASE_URL}/demands/${demandId}/items/${itemId}`,
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }))
    throw new Error(
      error.message || `Erro ao deletar item: ${response.statusText}`,
    )
  }
}
