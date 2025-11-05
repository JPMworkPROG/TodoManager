import { IDemandRepository } from '../repositories/IDemandRepository';
import { ListDemandsQueryDTO } from '../dtos/ListDemandsQueryDTO';
import { Demand } from '../entities/Demand';
import { PaginatedResult } from '../repositories/IDemandRepository';
import logger from '../../utils/logger';

export class ListDemandsUseCase {
  constructor(private readonly demandRepository: IDemandRepository) { }

  async execute(query: ListDemandsQueryDTO, requestId?: string): Promise<PaginatedResult<Demand>> {
    logger.info('Listing demands', {
      requestId,
      action: 'LIST_DEMANDS',
      filters: {
        status: query.status,
        startsAfter: query.startsAfter,
        endsBefore: query.endsBefore,
      },
      pagination: {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 20,
      },
    });

    const filters = {
      status: query.status,
      startsAfter: query.startsAfter ? new Date(query.startsAfter) : undefined,
      endsBefore: query.endsBefore ? new Date(query.endsBefore) : undefined,
    };

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const result = await this.demandRepository.findAll(filters, { page, pageSize });

    logger.info('Demands listed successfully', {
      requestId,
      action: 'LIST_DEMANDS',
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      page: result.page,
      pageSize: result.pageSize,
    });

    return result;
  }
}

