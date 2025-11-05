import { Demand } from '../entities/Demand';
import { DemandStatus } from '../entities/DemandStatus';

export interface DemandItemDTO {
   sku: string;
   description: string;
   plannedTotalTons: number;
   producedTotalTons: number | null;
}

export interface DemandDTO {
   id: string;
   title: string;
   description: string;
   status: DemandStatus;
   startDate: string;
   endDate: string;
   prodTotalTons: number;
   items: DemandItemDTO[];
   createdAt: string;
   updatedAt: string;
}

export function toDemandDTO(demand: Demand): DemandDTO {
   return {
      id: demand.id,
      title: demand.title,
      description: demand.description,
      status: demand.status,
      startDate: demand.startDate.toISOString().split('T')[0],
      endDate: demand.endDate.toISOString().split('T')[0],
      prodTotalTons: demand.prodTotalTons,
      items: demand.items.map((item) => ({
         sku: item.sku,
         description: item.description,
         plannedTotalTons: item.plannedTotalTons,
         producedTotalTons: item.producedTotalTons,
      })),
      createdAt: demand.createdAt.toISOString(),
      updatedAt: demand.updatedAt.toISOString(),
   };
}