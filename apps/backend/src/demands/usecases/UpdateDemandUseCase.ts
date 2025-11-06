import { IDemandRepository } from "../repositories/IDemandRepository";
import { UpdateDemandDTO } from "../dtos/UpdateDemandDTO";
import { Demand } from "../entities/Demand";
import {
  DemandNotFoundError,
  DemandConflictError,
  DemandValidationError,
} from "../errors/DemandErrors";
import logger from "../../utils/logger";

export class UpdateDemandUseCase {
  constructor(private readonly demandRepository: IDemandRepository) {}

  async execute(
    demandId: string,
    dto: UpdateDemandDTO,
    requestId?: string
  ): Promise<Demand> {
    logger.info("Updating demand", {
      requestId,
      action: "UPDATE_DEMAND",
      demandId,
      changes: {
        title: dto.title,
        status: dto.status,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
    });

    const existingDemand = await this.demandRepository.findById(demandId);

    if (!existingDemand) {
      logger.warn("Demand update failed: not found", {
        requestId,
        action: "UPDATE_DEMAND",
        demandId,
      });
      throw new DemandNotFoundError(demandId);
    }

    const demandWithSameTitle = await this.demandRepository.findByTitle(
      dto.title
    );
    if (demandWithSameTitle && demandWithSameTitle.id !== demandId) {
      logger.warn("Demand update failed: title conflict", {
        requestId,
        action: "UPDATE_DEMAND",
        demandId,
        title: dto.title,
        conflictingDemandId: demandWithSameTitle.id,
      });
      throw new DemandConflictError(
        `A demand with title "${dto.title}" already exists`,
        {
          title: dto.title,
        }
      );
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate < startDate) {
      logger.warn("Demand update failed: invalid date range", {
        requestId,
        action: "UPDATE_DEMAND",
        demandId,
        startDate: dto.startDate,
        endDate: dto.endDate,
      });
      throw new DemandValidationError(
        "End date must be greater than or equal to start date",
        {
          endDate: ["End date must be greater than or equal to start date"],
        }
      );
    }

    const demand = await this.demandRepository.update(demandId, {
      title: dto.title,
      description: dto.description.trim(),
      status: dto.status,
      startDate,
      endDate,
    });

    logger.info("Demand updated successfully", {
      requestId,
      action: "UPDATE_DEMAND",
      demandId,
      previousStatus: existingDemand.status,
      newStatus: demand.status,
      title: demand.title,
    });

    return demand;
  }
}
