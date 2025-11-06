import { Request, Response } from "express";
import { CreateDemandUseCase } from "../usecases/CreateDemandUseCase";
import { ListDemandsUseCase } from "../usecases/ListDemandsUseCase";
import { GetDemandUseCase } from "../usecases/GetDemandUseCase";
import { UpdateDemandUseCase } from "../usecases/UpdateDemandUseCase";
import { DeleteDemandUseCase } from "../usecases/DeleteDemandUseCase";
import { CreateDemandItemUseCase } from "../usecases/CreateDemandItemUseCase";
import { UpdateDemandItemUseCase } from "../usecases/UpdateDemandItemUseCase";
import { DeleteDemandItemUseCase } from "../usecases/DeleteDemandItemUseCase";
import { CreateDemandDTO } from "../dtos/CreateDemandDTO";
import { UpdateDemandDTO } from "../dtos/UpdateDemandDTO";
import { CreateDemandItemDTO } from "../dtos/CreateDemandItemDTO";
import { UpdateDemandItemDTO } from "../dtos/UpdateDemandItemDTO";
import { ListDemandsQueryDTO } from "../dtos/ListDemandsQueryDTO";
import { toDemandDTO, toDemandItemDTO, DemandDTO } from "../dtos/DemandDTO";
import { PaginatedResponseDTO, PaginationMetaDTO } from "../dtos/PaginationDTO";
import { DemandStatus } from "../entities/DemandStatus";

export class DemandController {
  constructor(
    private readonly createDemandUseCase: CreateDemandUseCase,
    private readonly listDemandsUseCase: ListDemandsUseCase,
    private readonly getDemandUseCase: GetDemandUseCase,
    private readonly updateDemandUseCase: UpdateDemandUseCase,
    private readonly deleteDemandUseCase: DeleteDemandUseCase,
    private readonly createDemandItemUseCase: CreateDemandItemUseCase,
    private readonly updateDemandItemUseCase: UpdateDemandItemUseCase,
    private readonly deleteDemandItemUseCase: DeleteDemandItemUseCase
  ) { }

  async create(req: Request, res: Response): Promise<void> {
    const dto: CreateDemandDTO = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      items: req.body.items,
    };

    const demand = await this.createDemandUseCase.execute(dto, req.requestId);
    const demandDTO = toDemandDTO(demand);

    res.status(201).location(`/api/demands/${demand.id}`).json(demandDTO);
  }

  async list(req: Request, res: Response): Promise<void> {
    const query: ListDemandsQueryDTO = {
      status: req.query.status ? (req.query.status as DemandStatus) : undefined,
      startsAfter: req.query.startsAfter as string | undefined,
      endsBefore: req.query.endsBefore as string | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    };

    const result = await this.listDemandsUseCase.execute(query, req.requestId);

    const meta: PaginationMetaDTO = {
      page: result.page,
      pageSize: result.pageSize,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };

    const response: PaginatedResponseDTO<DemandDTO> = {
      data: result.data.map(toDemandDTO),
      meta,
    };

    res.status(200).json(response);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const demandId = req.params.demandId as string;
    const demand = await this.getDemandUseCase.execute(demandId, req.requestId);
    const demandDTO = toDemandDTO(demand);

    res.status(200).json(demandDTO);
  }

  async update(req: Request, res: Response): Promise<void> {
    const demandId = req.params.demandId as string;
    const dto: UpdateDemandDTO = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    };

    const demand = await this.updateDemandUseCase.execute(
      demandId,
      dto,
      req.requestId
    );
    const demandDTO = toDemandDTO(demand);

    res.status(200).json(demandDTO);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const demandId = req.params.demandId as string;
    await this.deleteDemandUseCase.execute(demandId, req.requestId);

    res.status(204).send();
  }

  async createItem(req: Request, res: Response): Promise<void> {
    const demandId = req.params.demandId as string;
    const dto: CreateDemandItemDTO = {
      description: req.body.description,
      plannedTotalTons: req.body.plannedTotalTons,
      producedTotalTons: req.body.producedTotalTons,
    };

    const item = await this.createDemandItemUseCase.execute(
      demandId,
      dto,
      req.requestId
    );
    const itemDTO = toDemandItemDTO(item);

    res
      .status(201)
      .location(`/api/demands/${demandId}/items/${item.sku}`)
      .json(itemDTO);
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    const itemId = Number(req.params.itemId);
    const dto: UpdateDemandItemDTO = {
      description: req.body.description,
      plannedTotalTons: req.body.plannedTotalTons,
      producedTotalTons: req.body.producedTotalTons,
    };

    const item = await this.updateDemandItemUseCase.execute(
      itemId,
      dto,
      req.requestId
    );
    const itemDTO = toDemandItemDTO(item);

    res.status(200).json(itemDTO);
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    const itemId = Number(req.params.itemId);
    await this.deleteDemandItemUseCase.execute(itemId, req.requestId);

    res.status(204).send();
  }
}
