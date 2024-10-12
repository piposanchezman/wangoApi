import { Request, Response, Router } from "express"
import { WaterFootprintController } from "../controllers/WaterFootprintController"
import { DependencyContainer } from "../dependencies/DependencyContainer"

export class WaterFootprintRouter {
  static instance: WaterFootprintRouter
  private router: Router
  private waterFootprintController: WaterFootprintController

  private constructor(waterFootprintController: WaterFootprintController) {
    this.waterFootprintController = waterFootprintController
    this.router = Router()
    this.router.get("/info/:id", this.getWaterFootprint)
    this.router.put("/info/update", this.updateWaterFootprint)
    this.router.post("/new", this.createWaterFootprint)
    this.router.get("/info", this.getWaterFootprintByCropIdAndCollectionId)
    this.router.get("/suggestion-ia", this.getWaterFootprintsuggestion)
  }
  static getRouter(): Router {
    if (!WaterFootprintRouter.instance) {
      const waterFootprintController = new WaterFootprintController(
        DependencyContainer.waterFootprintRepository,
        DependencyContainer.collectionRecordRepository,
        DependencyContainer.cropRepository,
        DependencyContainer.userRepository
      )
      WaterFootprintRouter.instance = new WaterFootprintRouter(waterFootprintController)
    }
    return WaterFootprintRouter.instance.router
  }
  private getWaterFootprint = async (req: Request, res: Response) => {
    try {
      const collectionId = req.params.collectionId
      const response = await this.waterFootprintController.getWaterFootprintByCollectionId(
        collectionId
      )
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        })
      }
      return res.status(response.code).send({
        data: response.data,
        status: "success",
        message: response.message,
      })
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      })
    }
  }
  private createWaterFootprint = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const waterFootprint = req.body
      const userId = req.user.sub
      const response = await this.waterFootprintController.getWaterFootprintByCropIdAndCollectionId(
        waterFootprint.collection_id,
        waterFootprint.crop_id,
        userId
      )
      if (response.status === "success") {
        return res.status(200).send({
          status: "success",
          message: "Water footprint already exists, returning existing data",
        })
      } else {
        const response = await this.waterFootprintController.createWaterFootprint(
          waterFootprint,
          userId
        )
        if (response.status === "error") {
          return res.status(response.code).send({
            status: "error",
            message: response.message,
          })
        } else {
          return res.status(response.code).send({
            data: response.data,
            status: "success",
            message: response.message,
          })
        }
      }
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      })
    }
  }
  private getWaterFootprintByCropIdAndCollectionId = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const userId = req.user.sub
      const collectionId = req.query.collection_id as string
      const cropId = req.query.crop_id as string
      const response = await this.waterFootprintController.getWaterFootprintByCropIdAndCollectionId(
        collectionId,
        cropId,
        userId
      )
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        })
      }
      return res.status(response.code).send({
        data: response.data,
        status: "success",
        message: response.message,
      })
    } catch (error: any) {
      return res.status(500).send({
        status: "error",
        message: error.message,
      })
    }
  }
  private updateWaterFootprint = async (req: Request, res: Response) => {
    res.status(200).send({
      message: "updateWaterFootprint",
    })
  }
  private getWaterFootprintsuggestion = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const collectionId = req.query.collection_id as string
      const cropId = req.query.crop_id as string
      const userId = req.user.sub
      const response = await this.waterFootprintController.getWaterFootprintSuggestion(
        collectionId,
        cropId,
        userId
      )
      if (response.status === "error") {
        return res.status(response.code).send({
          status: "error",
          message: response.message,
        })
      }
      return res.status(response.code).send({
        data: response.data,
        status: "success",
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
