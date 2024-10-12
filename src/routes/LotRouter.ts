import { Request, Response, Router } from "express"
import { CollectionMongoRepository } from "../Respositories/CollectionRepositorie"
import { CollectionRecordMongoRepository } from "../Respositories/CollectionRecordRepositorie"
import { CropMongoRepository } from "../Respositories/CropRepositorie"
import { LotMongoRespositorie } from "../Respositories/LotRepositorie"
import { CropController } from "../controllers/CropController"
import { CollectionCropController } from "../controllers/CollectionCropController"
import { CollectionRecordController } from "../controllers/CollectionRecordController"
import { LotController } from "../controllers/LotController"
export class LotRouter {
  private static instance: LotRouter
  private router: Router
  private lotController: LotController
  private constructor(lotController: LotController) {
    this.router = Router()
    this.lotController = lotController
    this.router.post("/new", this.createNewLot)
    this.router.get("/user", this.getLotsByUser)
    this.router.get("/info/:id", this.getLotById)
    this.router.get("/paginated", this.getLotsPaginatedByUser)
    this.router.delete("/delete/:id", this.deleteLotById)
    this.router.put("/update/:id", this.updateLotById)
  }
  static getRouter(): Router {
    if (!LotRouter.instance) {
      const collectionRepositorie = new CollectionMongoRepository()
      const collectionRecordRepositorie = new CollectionRecordMongoRepository()
      const cropRepositorie = new CropMongoRepository()
      const lotRespositorie = new LotMongoRespositorie()
      const collectionRecordController = new CollectionRecordController(
        collectionRecordRepositorie,
        collectionRepositorie
      )
      const collectionController = new CollectionCropController(
        collectionRepositorie,
        cropRepositorie,
        collectionRecordController
      )
      const cropController = new CropController(
        cropRepositorie,
        lotRespositorie,
        collectionController
      )
      const lotController = new LotController(lotRespositorie, cropController)
      LotRouter.instance = new LotRouter(lotController)
    }
    return LotRouter.instance.router
  }
  private createNewLot = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const userId = req.user.sub
      const data = req.body

      const response = await this.lotController.createNewLot(data, userId)
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        })
      }
      return res.status(response.code).send({
        status: response.status,
        data: response.data,
        message: response.message,
      })
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      })
    }
  }
  private getLotsByUser = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const userId = req.user.sub

      const response = await this.lotController.getLotByUser(userId)
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        })
      }
      return res.status(response.code).send({
        status: response.status,
        data: response.data,
        message: response.message,
      })
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      })
    }
  }
  private getLotsPaginatedByUser = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const userId = req.user.sub
      const page = parseInt(req.query.page as string)
      const limit = parseInt(req.query.limit as string)

      const response = await this.lotController.getLotsPaginated(page, limit, userId)
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        })
      }
      return res.status(response.code).send({
        status: response.status,
        data: response.data,
        message: response.message,
      })
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      })
    }
  }
  private getLotById = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const lotId = req.params.id
      const response = await this.lotController.getLotById(lotId)
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        })
      }
      return res.status(response.code).send({
        status: response.status,
        data: response.data,
        message: response.message,
      })
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      })
    }
  }
  private deleteLotById = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const lotId = req.params.id
      const response = await this.lotController.deleteLot(lotId)
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        })
      }
      return res.status(response.code).send({
        status: response.status,
        data: response.data,
        message: response.message,
      })
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      })
    }
  }
  private updateLotById = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const lotId = req.params.id
      const data = req.body
      const response = await this.lotController.updateLotInfo(lotId, data)
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        })
      }
      return res.status(response.code).send({
        status: response.status,
        data: response.data,
        message: response.message,
      })
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      })
    }
  }
}
