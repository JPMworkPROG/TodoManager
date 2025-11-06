import { Router, Request, Response, NextFunction } from "express";
import { DemandController } from "../controllers/DemandController";
import { CreateDemandUseCase } from "../usecases/CreateDemandUseCase";
import { ListDemandsUseCase } from "../usecases/ListDemandsUseCase";
import { GetDemandUseCase } from "../usecases/GetDemandUseCase";
import { UpdateDemandUseCase } from "../usecases/UpdateDemandUseCase";
import { DeleteDemandUseCase } from "../usecases/DeleteDemandUseCase";
import { CreateDemandItemUseCase } from "../usecases/CreateDemandItemUseCase";
import { UpdateDemandItemUseCase } from "../usecases/UpdateDemandItemUseCase";
import { DeleteDemandItemUseCase } from "../usecases/DeleteDemandItemUseCase";
import { DemandRepository } from "../repositories/DemandRepository";
import { createDemandValidator } from "../validators/createDemandValidator";
import { updateDemandValidator } from "../validators/updateDemandValidator";
import { listDemandsValidator } from "../validators/listDemandsValidator";
import { getDemandValidator } from "../validators/getDemandValidator";
import { createDemandItemValidator } from "../validators/createDemandItemValidator";
import { updateDemandItemValidator } from "../validators/updateDemandItemValidator";
import { getItemIdValidator } from "../validators/getItemIdValidator";
import { validationMiddleware } from "../../middlewares/validationMiddleware";
import { errorHandlerMiddleware } from "../../middlewares/errorHandlerMiddleware";
import { requestLoggerMiddleware } from "../../middlewares/requestLoggerMiddleware";

const router = Router();

router.use(requestLoggerMiddleware);

const demandRepository = new DemandRepository();
const createDemandUseCase = new CreateDemandUseCase(demandRepository);
const listDemandsUseCase = new ListDemandsUseCase(demandRepository);
const getDemandUseCase = new GetDemandUseCase(demandRepository);
const updateDemandUseCase = new UpdateDemandUseCase(demandRepository);
const deleteDemandUseCase = new DeleteDemandUseCase(demandRepository);
const createDemandItemUseCase = new CreateDemandItemUseCase(demandRepository);
const updateDemandItemUseCase = new UpdateDemandItemUseCase(demandRepository);
const deleteDemandItemUseCase = new DeleteDemandItemUseCase(demandRepository);
const demandController = new DemandController(
  createDemandUseCase,
  listDemandsUseCase,
  getDemandUseCase,
  updateDemandUseCase,
  deleteDemandUseCase,
  createDemandItemUseCase,
  updateDemandItemUseCase,
  deleteDemandItemUseCase
);

router.get(
  "/",
  listDemandsValidator,
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await demandController.list(req, res);
    } catch (error) {
      next(error);
    }
  },
  errorHandlerMiddleware
);

router.post(
  "/",
  createDemandValidator,
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await demandController.create(req, res);
    } catch (error) {
      next(error);
    }
  },
  errorHandlerMiddleware
);

router.get(
  "/:demandId",
  getDemandValidator,
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await demandController.getById(req, res);
    } catch (error) {
      next(error);
    }
  },
  errorHandlerMiddleware
);

router.patch(
  "/:demandId",
  getDemandValidator,
  updateDemandValidator,
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await demandController.update(req, res);
    } catch (error) {
      next(error);
    }
  },
  errorHandlerMiddleware
);

router.delete(
  "/:demandId",
  getDemandValidator,
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await demandController.delete(req, res);
    } catch (error) {
      next(error);
    }
  },
  errorHandlerMiddleware
);

router.post(
  "/:demandId/items",
  getDemandValidator,
  createDemandItemValidator,
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await demandController.createItem(req, res);
    } catch (error) {
      next(error);
    }
  },
  errorHandlerMiddleware
);

router.patch(
  "/:demandId/items/:itemId",
  getDemandValidator,
  getItemIdValidator,
  updateDemandItemValidator,
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await demandController.updateItem(req, res);
    } catch (error) {
      next(error);
    }
  },
  errorHandlerMiddleware
);

router.delete(
  "/:demandId/items/:itemId",
  getDemandValidator,
  getItemIdValidator,
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await demandController.deleteItem(req, res);
    } catch (error) {
      next(error);
    }
  },
  errorHandlerMiddleware
);

export default router;
