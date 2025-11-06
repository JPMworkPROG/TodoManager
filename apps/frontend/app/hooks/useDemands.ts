import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchDemands,
  createDemand,
  fetchDemand,
  updateDemand,
  deleteDemand,
  createDemandItem,
  updateDemandItem,
  deleteDemandItem,
  type Demand,
  type PaginatedDemandsResponse,
  type CreateDemandPayload,
  type UpdateDemandPayload,
  type DemandItemCreatePayload,
  type DemandItemUpdatePayload,
} from '../api/demands'

export type {
  Demand,
  DemandStatus,
  CreateDemandPayload,
  UpdateDemandPayload,
  DemandItemInput,
  DemandItemCreatePayload,
  DemandItemUpdatePayload,
} from '../api/demands'

export const useFetchDemands = (page: number, pageSize: number) => {
  return useQuery<PaginatedDemandsResponse>({
    queryKey: ['demands', page, pageSize],
    queryFn: () => fetchDemands(page, pageSize),
    staleTime: 1000 * 5,
  })
}

export const useCreateDemand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateDemandPayload) => createDemand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] })
    },
  })
}

export const useFetchDemand = (demandId: string | null) => {
  return useQuery<Demand>({
    queryKey: ['demand', demandId],
    queryFn: () => fetchDemand(demandId!),
    enabled: !!demandId,
  })
}

export const useUpdateDemand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      demandId,
      payload,
    }: {
      demandId: string
      payload: UpdateDemandPayload
    }) => updateDemand(demandId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] })
      queryClient.invalidateQueries({ queryKey: ['demand'] })
    },
  })
}

export const useDeleteDemand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (demandId: string) => deleteDemand(demandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] })
      queryClient.invalidateQueries({ queryKey: ['demand'] })
    },
  })
}

export const useCreateDemandItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      demandId,
      payload,
    }: {
      demandId: string
      payload: DemandItemCreatePayload
    }) => createDemandItem(demandId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['demands'] })
      queryClient.invalidateQueries({
        queryKey: ['demand', variables.demandId],
      })
    },
  })
}

export const useUpdateDemandItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      demandId,
      itemId,
      payload,
    }: {
      demandId: string
      itemId: number
      payload: DemandItemUpdatePayload
    }) => updateDemandItem(demandId, itemId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['demands'] })
      queryClient.invalidateQueries({
        queryKey: ['demand', variables.demandId],
      })
    },
  })
}

export const useDeleteDemandItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ demandId, itemId }: { demandId: string; itemId: number }) =>
      deleteDemandItem(demandId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['demands'] })
      queryClient.invalidateQueries({
        queryKey: ['demand', variables.demandId],
      })
    },
  })
}
