import { DemandStatus } from "../entities/DemandStatus";

export interface DemandItemInputDTO {
  description: string;
  plannedTotalTons: number;
}

export interface CreateDemandDTO {
  title: string;
  description: string;
  status: DemandStatus;
  startDate: string;
  endDate: string;
  items: DemandItemInputDTO[];
}
