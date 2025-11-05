import { DemandStatus } from '../entities/DemandStatus';

export interface ListDemandsQueryDTO {
  status?: DemandStatus;
  startsAfter?: string;
  endsBefore?: string;
  page?: number;
  pageSize?: number;
}