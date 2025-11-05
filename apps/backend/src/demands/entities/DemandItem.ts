export class DemandItem {
   constructor(
      public readonly id: string,
      public readonly sku: string,
      public readonly description: string,
      public readonly plannedTotalTons: number,
      public readonly producedTotalTons: number | null,
      public readonly demandId: string,
   ) { }

   static fromPrisma(data: {
      id: string;
      sku: string;
      description: string;
      plannedTotalTons: number;
      producedTotalTons: number | null;
      demandId: string;
   }): DemandItem {
      return new DemandItem(
         data.id,
         data.sku,
         data.description,
         data.plannedTotalTons,
         data.producedTotalTons,
         data.demandId,
      );
   }
}

