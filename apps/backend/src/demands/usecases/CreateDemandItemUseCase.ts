import { IDemandRepository } from '../repositories/IDemandRepository';
import { CreateDemandItemDTO } from '../dtos/CreateDemandItemDTO';
import { DemandItem } from '../entities/DemandItem';
import { DemandNotFoundError } from '../errors/DemandErrors';
import logger from '../../utils/logger';

export class CreateDemandItemUseCase {
   constructor(private readonly demandRepository: IDemandRepository) { }

   async execute(demandId: string, dto: CreateDemandItemDTO, requestId?: string): Promise<DemandItem> {
      logger.info('Creating demand item', {
         requestId,
         action: 'CREATE_DEMAND_ITEM',
         demandId,
         description: dto.description,
      });

      const demand = await this.demandRepository.findById(demandId);
      if (!demand) {
         logger.warn('Demand item creation failed: demand not found', {
            requestId,
            action: 'CREATE_DEMAND_ITEM',
            demandId,
         });
         throw new DemandNotFoundError(demandId);
      }

      const item = await this.demandRepository.createItem(demandId, {
         description: dto.description.trim(),
         plannedTotalTons: dto.plannedTotalTons,
         producedTotalTons: dto.producedTotalTons,
      });

      logger.info('Demand item created successfully', {
         requestId,
         action: 'CREATE_DEMAND_ITEM',
         sku: item.sku,
         demandId: item.demandId,
         description: item.description,
      });

      return item;
   }
}

