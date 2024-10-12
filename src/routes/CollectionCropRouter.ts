import { Request, Response, Router } from "express"
import { CollectionCropController } from "../controllers/CollectionCropController"
import { CollectionMongoRepository } from "../Respositories/CollectionRepositorie"
import { CropMongoRepository } from "../Respositories/CropRepositorie"
import { CollectionRecordMongoRepository } from "../Respositories/CollectionRecordRepositorie"
import { CollectionRecordController } from "../controllers/CollectionRecordController"
export class CollectionCropRouter {
  private static instance: CollectionCropRouter
  private router: Router
  private collectionController: CollectionCropController

  private constructor(collectionController: CollectionCropController) {
    this.router = Router()
    this.collectionController = collectionController
    this.router.delete("/delete/:id", this.deleteCollectionById)
    this.router.post("/new", this.createNewCollection)
    this.router.get("/info/:id", this.getCollectionById)
    this.router.get("/info/crop/:id", this.getLastCollectionByCropId)
    this.router.get("/info/crop/:id/paginated", this.getPaginatedCollectionsByCropId)
    this.router.put("/update/status/:id", this.updateCollectionStatus)
  }
  static getRouter(): Router {
    if (!CollectionCropRouter.instance) {
      const collectionRepository = new CollectionMongoRepository()
      const cropRepository = new CropMongoRepository()
      const collectionRecordRepository = new CollectionRecordMongoRepository()
      const collectionRecordController = new CollectionRecordController(
        collectionRecordRepository,
        collectionRepository
      )
      const collectionController = new CollectionCropController(
        collectionRepository,
        cropRepository,
        collectionRecordController
      )
      CollectionCropRouter.instance = new CollectionCropRouter(collectionController)
    }
    return CollectionCropRouter.instance.router
  }
  private createNewCollection = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const userId = req.user.sub
      const data = req.body
      const response = await this.collectionController.createNewCollection(data, userId)
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
  private deleteCollectionById = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const collectionId = req.params.id
      const response = await this.collectionController.deleteCollectionById(collectionId)
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
  private getCollectionById = async (req: Request, res: Response) => {
    try {
      const collectionId = req.params.id
      const response = await this.collectionController.findCollectionById(collectionId)
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
  private getLastCollectionByCropId = async (req: Request, res: Response) => {
    try {
      const cropId = req.params.id
      const response = await this.collectionController.findLastCollectonByCropId(cropId)
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
  private getPaginatedCollectionsByCropId = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const cropId = req.params.id
      const page = parseInt(req.query.page as string)
      const limit = parseInt(req.query.limit as string)
      const userId = req.user.sub
      const response = await this.collectionController.getPaginatedCollectionsByCropId(
        cropId,
        page,
        limit,
        userId
      )
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
  private updateCollectionStatus = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const collectionId = req.params.id
      const collection = req.body
      const response = await this.collectionController.updateCollectionStatus(
        collectionId,
        collection
      )
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
