import prisma from '../../database/prisma';
import { Demand } from '../entities/Demand';
import { DemandItem } from '../entities/DemandItem';
import { IDemandRepository, FindAllFilters, PaginationOptions, PaginatedResult } from './IDemandRepository';

export class DemandRepository implements IDemandRepository {
  async create(data: {
    title: string;
    description: string;
    status: string;
    startDate: Date;
    endDate: Date;
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

  async createItem(demandId: string, data: {
    description: string;
    plannedTotalTons: number;
    producedTotalTons?: number;
  }): Promise<DemandItem> {
    const item = await prisma.demandItem.create({
      data: {
        demandId,
        description: data.description,
        plannedTotalTons: data.plannedTotalTons,
        producedTotalTons: data.producedTotalTons ?? 0,
      },
    });

    return DemandItem.fromPrisma(item);
  }

  async findItemBySku(sku: number): Promise<DemandItem | null> {
    const item = await prisma.demandItem.findUnique({
      where: { sku },
    });

    return item ? DemandItem.fromPrisma(item) : null;
  }

  async updateItem(sku: number, data: {
    description?: string;
    plannedTotalTons?: number;
    producedTotalTons?: number;
  }): Promise<DemandItem> {
    const updateData: {
      description?: string;
      plannedTotalTons?: number;
      producedTotalTons?: number;
    } = {};

    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.plannedTotalTons !== undefined) {
      updateData.plannedTotalTons = data.plannedTotalTons;
    }
    if (data.producedTotalTons !== undefined) {
      updateData.producedTotalTons = data.producedTotalTons;
    }

    const item = await prisma.demandItem.update({
      where: { sku },
      data: updateData,
    });

    return DemandItem.fromPrisma(item);
  }
}

