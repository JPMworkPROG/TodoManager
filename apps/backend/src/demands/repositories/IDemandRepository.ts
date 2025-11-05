import { Demand } from '../entities/Demand';

export interface FindAllFilters {
  status?: string;
  startsAfter?: Date;
  endsBefore?: Date;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IDemandRepository {
  create(data: {
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
  }): Promise<Demand>;
  findByTitle(title: string): Promise<Demand | null>;
  findById(id: string): Promise<Demand | null>;
  findAll(filters: FindAllFilters, pagination: PaginationOptions): Promise<PaginatedResult<Demand>>;
  update(id: string, data: {
    title: string;
    description: string;
    status: string;
    endDate: Date;
  }): Promise<Demand>;
  delete(id: string): Promise<void>;
}

