import { IDemandRepository } from '../repositories/IDemandRepository';
import { CreateDemandDTO } from '../dtos/CreateDemandDTO';
import { Demand } from '../entities/Demand';
import { DemandConflictError } from '../errors/DemandErrors';
import logger from '../../utils/logger';

export class CreateDemandUseCase {
   constructor(private readonly demandRepository: IDemandRepository) { }

   async execute(dto: CreateDemandDTO, requestId?: string): Promise<Demand> {
      logger.info('Creating demand', {
         requestId,
         action: 'CREATE_DEMAND',
         title: dto.title,
         status: dto.status,
      });

      const existingDemand = await this.demandRepository.findByTitle(dto.title);
      if (existingDemand) {
         logger.warn('Demand creation failed: title already exists', {
            requestId,
            action: 'CREATE_DEMAND',
            title: dto.title,
            existingDemandId: existingDemand.id,
         });
         throw new DemandConflictError(
            `A demand with title "${dto.title}" already exists`,
            { title: dto.title },
         );
      }

      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);

      const demand = await this.demandRepository.create({
         title: dto.title,
         description: dto.description.trim(),
         status: dto.status,
         startDate,
         endDate,
         prodTotalTons: 0,
         items: dto.items.map((item) => ({
            description: item.description.trim(),
            plannedTotalTons: item.plannedTotalTons,
         })),
      });

      logger.info('Demand created successfully', {
         requestId,
         action: 'CREATE_DEMAND',
         demandId: demand.id,
         title: demand.title,
         status: demand.status,
      });

      return demand;
   }
}

