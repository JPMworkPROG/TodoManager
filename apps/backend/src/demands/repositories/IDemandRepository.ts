import { Demand } from "../entities/Demand";
import { DemandItem } from "../entities/DemandItem";

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
    items: Array<{
      description: string;
      plannedTotalTons: number;
    }>;
  }): Promise<Demand>;
  findByTitle(title: string): Promise<Demand | null>;
  findById(id: string): Promise<Demand | null>;
  findAll(
    filters: FindAllFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Demand>>;
  update(
    id: string,
    data: {
      title: string;
      description: string;
      status: string;
      startDate: Date;
      endDate: Date;
    }
  ): Promise<Demand>;
  delete(id: string): Promise<void>;
  createItem(
    demandId: string,
    data: {
      description: string;
      plannedTotalTons: number;
      producedTotalTons?: number;
    }
  ): Promise<DemandItem>;
  findItemBySku(sku: number): Promise<DemandItem | null>;
  updateItem(
    sku: number,
    data: {
      description?: string;
      plannedTotalTons?: number;
      producedTotalTons?: number;
    }
  ): Promise<DemandItem>;
  deleteItem(sku: number): Promise<void>;
}
