import { Router, Request, Response } from "express"
import { CropController } from "../controllers/CropController"
import { DependencyContainer } from "../dependencies/DependencyContainer"
export class CropRouter {
  private static instance: CropRouter
  private router: Router
  private cropController: CropController

  private constructor(cropController: CropController) {
    this.router = Router()
    this.cropController = cropController
    this.router.post("/new", this.createNewCrop)
    this.router.get("/user", this.getCropsByUser)
    this.router.get("/paginated", this.getCropsPaginated)
    this.router.get("/info/:id", this.getCropById)
    this.router.delete("/delete/:id", this.deleteCropById)
    this.router.put("/update/:id", this.updateCropById)
  }
  static getRouter(): Router {
    if (!CropRouter.instance) {
      CropRouter.instance = new CropRouter(DependencyContainer.cropController)
    }
    return CropRouter.instance.router
  }
  private createNewCrop = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const userId = req.user.sub
      const data = req.body

      const response = await this.cropController.createNewCrop(data, userId)
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
  private getCropsByUser = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const userId = req.user.sub

      const response = await this.cropController.getCropsByUser(userId)
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
  private getCropById = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const cropId = req.params.id

      const response = await this.cropController.getCropInfo(cropId)
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
  private getCropsPaginated = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const userId = req.user.sub
      const page = parseInt(req.query.page as string)
      const limit = parseInt(req.query.limit as string)
      const lotId = req.query.lot_id as string
      const response = await this.cropController.getCropsPaginated(page, limit, userId, lotId)
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
  private deleteCropById = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const cropId = req.params.id
      const data = req.body
      if (!data.lot_id) {
        return res.status(400).send({
          status: "error",
          message: "Lot_id is required to delete the crop",
        })
      }
      const response = await this.cropController.deleteCrop(data, cropId)
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
  private updateCropById = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const cropId = req.params.id
      const data = req.body
      const response = await this.cropController.updateCropInfo(cropId, data)
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
