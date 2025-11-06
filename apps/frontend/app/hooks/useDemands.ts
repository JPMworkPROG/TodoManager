import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchDemands, createDemand, fetchDemand, updateDemand, type Demand, type PaginatedDemandsResponse, type CreateDemandPayload, type UpdateDemandPayload } from "../api/demands"

export type { Demand, DemandStatus, CreateDemandPayload, UpdateDemandPayload, DemandItemInput } from "../api/demands"

export const useDemands = (page: number, pageSize: number) => {
   return useQuery<PaginatedDemandsResponse>({
      queryKey: ['demands', page, pageSize],
      queryFn: () => fetchDemands(page, pageSize),
      staleTime: 1000 * 5
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

export const useDemand = (demandId: string | null) => {
   return useQuery<Demand>({
      queryKey: ['demand', demandId],
      queryFn: () => fetchDemand(demandId!),
      enabled: !!demandId,
   })
}

export const useUpdateDemand = () => {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ demandId, payload }: { demandId: string; payload: UpdateDemandPayload }) => 
         updateDemand(demandId, payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['demands'] })
         queryClient.invalidateQueries({ queryKey: ['demand'] })
      },
   })
}