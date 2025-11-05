import { DemandItem } from './DemandItem';
import { DemandStatus } from './DemandStatus';

export class Demand {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: DemandStatus,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly prodTotalTons: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly items: DemandItem[],
  ) {}

  static fromPrisma(data: {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: Date;
    endDate: Date;
    prodTotalTons: number;
    createdAt: Date;
    updatedAt: Date;
    items: Array<{
      id: string;
      sku: string;
      description: string;
      plannedTotalTons: number;
      producedTotalTons: number | null;
      demandId: string;
    }>;
  }): Demand {
    return new Demand(
      data.id,
      data.title,
      data.description,
      data.status as DemandStatus,
      data.startDate,
      data.endDate,
      data.prodTotalTons,
      data.createdAt,
      data.updatedAt,
      data.items.map(DemandItem.fromPrisma),
    );
  }
}

