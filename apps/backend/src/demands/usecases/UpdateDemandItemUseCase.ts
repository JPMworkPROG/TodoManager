import { IDemandRepository } from "../repositories/IDemandRepository";
import { UpdateDemandItemDTO } from "../dtos/UpdateDemandItemDTO";
import { DemandItem } from "../entities/DemandItem";
import { DemandNotFoundError } from "../errors/DemandErrors";
import logger from "../../utils/logger";

export class UpdateDemandItemUseCase {
  constructor(private readonly demandRepository: IDemandRepository) {}

  async execute(
    sku: number,
    dto: UpdateDemandItemDTO,
    requestId?: string
  ): Promise<DemandItem> {
    logger.info("Updating demand item", {
      requestId,
      action: "UPDATE_DEMAND_ITEM",
      sku,
      changes: {
        description: dto.description !== undefined,
        plannedTotalTons: dto.plannedTotalTons !== undefined,
        producedTotalTons: dto.producedTotalTons !== undefined,
      },
    });

    const existingItem = await this.demandRepository.findItemBySku(sku);
    if (!existingItem) {
      logger.warn("Demand item update failed: not found", {
        requestId,
        action: "UPDATE_DEMAND_ITEM",
        sku,
      });
      throw new DemandNotFoundError(sku.toString());
    }

    const updateData: {
      description?: string;
      plannedTotalTons?: number;
      producedTotalTons?: number;
    } = {};

    if (dto.description !== undefined) {
      updateData.description = dto.description.trim();
    }
    if (dto.plannedTotalTons !== undefined) {
      updateData.plannedTotalTons = dto.plannedTotalTons;
    }
    if (dto.producedTotalTons !== undefined) {
      updateData.producedTotalTons = dto.producedTotalTons;
    }

    const item = await this.demandRepository.updateItem(sku, updateData);

    logger.info("Demand item updated successfully", {
      requestId,
      action: "UPDATE_DEMAND_ITEM",
      sku,
      demandId: item.demandId,
    });

    return item;
  }
}
