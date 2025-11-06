export class DemandItem {
   constructor(
      public readonly sku: number,
      public readonly description: string,
      public readonly plannedTotalTons: number,
      public readonly producedTotalTons: number | null,
      public readonly demandId: string,
   ) { }

   static fromPrisma(data: {
      sku: number;
      description: string;
      plannedTotalTons: number;
      producedTotalTons: number | null;
      demandId: string;
   }): DemandItem {
      return new DemandItem(
         data.sku,
         data.description,
         data.plannedTotalTons,
         data.producedTotalTons,
         data.demandId,
      );
   }
}

