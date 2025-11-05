import prisma from '../../database/prisma';
import { Demand } from '../entities/Demand';
import { IDemandRepository, FindAllFilters, PaginationOptions, PaginatedResult } from './IDemandRepository';

export class DemandRepository implements IDemandRepository {
  async create(data: {
    title: string;
    description: string;
    status: string;
    startDate: Date;
    endDate: Date;
    prodTotalTons: number;
    items: Array<{
      description: string;
      plannedTotalTons: number;
    }>;
  }): Promise<Demand> {
    const demand = await prisma.demand.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        prodTotalTons: data.prodTotalTons,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            plannedTotalTons: item.plannedTotalTons,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return Demand.fromPrisma(demand);
  }

  async findByTitle(title: string): Promise<Demand | null> {
    const demand = await prisma.demand.findFirst({
      where: { title },
      include: {
        items: true,
      },
    });

    return demand ? Demand.fromPrisma(demand) : null;
  }

  async findById(id: string): Promise<Demand | null> {
    const demand = await prisma.demand.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    return demand ? Demand.fromPrisma(demand) : null;
  }

  async findAll(filters: FindAllFilters, pagination: PaginationOptions): Promise<PaginatedResult<Demand>> {
    const where: Record<string, unknown> = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startsAfter) {
      where.startDate = {
        gte: filters.startsAfter,
      };
    }

    if (filters.endsBefore) {
      where.endDate = {
        lte: filters.endsBefore,
      };
    }

    const skip = (pagination.page - 1) * pagination.pageSize;

    const [demands, totalItems] = await Promise.all([
      prisma.demand.findMany({
        where,
        include: {
          items: true,
        },
        skip,
        take: pagination.pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.demand.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / pagination.pageSize);

    return {
      data: demands.map(Demand.fromPrisma),
      totalItems,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages,
    };
  }

  async update(id: string, data: {
    title: string;
    description: string;
    status: string;
    endDate: Date;
  }): Promise<Demand> {
    const demand = await prisma.demand.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        endDate: data.endDate,
      },
      include: {
        items: true,
      },
    });

    return Demand.fromPrisma(demand);
  }

  async delete(id: string): Promise<void> {
    await prisma.demand.delete({
      where: { id },
    });
  }
}

