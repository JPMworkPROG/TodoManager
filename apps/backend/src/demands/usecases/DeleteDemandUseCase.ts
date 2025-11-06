import { IDemandRepository } from "../repositories/IDemandRepository";
import { DemandNotFoundError } from "../errors/DemandErrors";
import logger from "../../utils/logger";

export class DeleteDemandUseCase {
  constructor(private readonly demandRepository: IDemandRepository) {}

  async execute(demandId: string, requestId?: string): Promise<void> {
    logger.info("Deleting demand", {
      requestId,
      action: "DELETE_DEMAND",
      demandId,
    });

    const demand = await this.demandRepository.findById(demandId);

    if (!demand) {
      logger.warn("Demand deletion failed: not found", {
        requestId,
        action: "DELETE_DEMAND",
        demandId,
      });
      throw new DemandNotFoundError(demandId);
    }

    await this.demandRepository.delete(demandId);

    logger.info("Demand deleted successfully", {
      requestId,
      action: "DELETE_DEMAND",
      demandId,
      title: demand.title,
      status: demand.status,
    });
  }
}
