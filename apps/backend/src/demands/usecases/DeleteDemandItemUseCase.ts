import { IDemandRepository } from "../repositories/IDemandRepository";
import { DemandNotFoundError } from "../errors/DemandErrors";
import logger from "../../utils/logger";

export class DeleteDemandItemUseCase {
  constructor(private readonly demandRepository: IDemandRepository) {}

  async execute(sku: number, requestId?: string): Promise<void> {
    logger.info("Deleting demand item", {
      requestId,
      action: "DELETE_DEMAND_ITEM",
      sku,
    });

    const existingItem = await this.demandRepository.findItemBySku(sku);
    if (!existingItem) {
      logger.warn("Demand item deletion failed: not found", {
        requestId,
        action: "DELETE_DEMAND_ITEM",
        sku,
      });
      throw new DemandNotFoundError(sku.toString());
    }

    await this.demandRepository.deleteItem(sku);

    logger.info("Demand item deleted successfully", {
      requestId,
      action: "DELETE_DEMAND_ITEM",
      sku,
      demandId: existingItem.demandId,
    });
  }
}
