import { Demand } from "../entities/Demand";
import { DemandItem } from "../entities/DemandItem";
import { DemandStatus } from "../entities/DemandStatus";

export interface DemandItemDTO {
  sku: number;
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
  items: DemandItemDTO[];
  createdAt: string;
  updatedAt: string;
}

export function toDemandItemDTO(item: DemandItem): DemandItemDTO {
  return {
    sku: item.sku,
    description: item.description,
    plannedTotalTons: item.plannedTotalTons,
    producedTotalTons: item.producedTotalTons,
  };
}

export function toDemandDTO(demand: Demand): DemandDTO {
  return {
    id: demand.id,
    title: demand.title,
    description: demand.description,
    status: demand.status,
    startDate: demand.startDate.toISOString().split("T")[0],
    endDate: demand.endDate.toISOString().split("T")[0],
    items: demand.items.map(toDemandItemDTO),
    createdAt: demand.createdAt.toISOString(),
    updatedAt: demand.updatedAt.toISOString(),
  };
}
