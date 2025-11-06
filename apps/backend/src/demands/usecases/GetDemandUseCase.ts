import { IDemandRepository } from "../repositories/IDemandRepository";
import { Demand } from "../entities/Demand";
import { DemandNotFoundError } from "../errors/DemandErrors";
import logger from "../../utils/logger";

export class GetDemandUseCase {
  constructor(private readonly demandRepository: IDemandRepository) {}

  async execute(demandId: string, requestId?: string): Promise<Demand> {
    logger.info("Fetching demand", {
      requestId,
      action: "GET_DEMAND",
      demandId,
    });

    const demand = await this.demandRepository.findById(demandId);

    if (!demand) {
      logger.warn("Demand fetch failed: not found", {
        requestId,
        action: "GET_DEMAND",
        demandId,
      });
      throw new DemandNotFoundError(demandId);
    }

    logger.info("Demand fetched successfully", {
      requestId,
      action: "GET_DEMAND",
      demandId,
      status: demand.status,
    });

    return demand;
  }
}
