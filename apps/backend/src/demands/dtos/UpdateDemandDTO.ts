import { DemandStatus } from '../entities/DemandStatus';

export interface UpdateDemandDTO {
   title: string;
   description: string;
   status: DemandStatus;
   endDate: string;
}
