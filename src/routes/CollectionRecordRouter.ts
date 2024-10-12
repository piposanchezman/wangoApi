import { Router, Request, Response } from "express"
import { CollectionRecordMongoRepository } from "../Respositories/CollectionRecordRepositorie"
import { CollectionMongoRepository } from "../Respositories/CollectionRepositorie"
import { CollectionRecordController } from "../controllers/CollectionRecordController"

export class ColecctionRecordRouter {
  private static instance: ColecctionRecordRouter
  private router: Router
  private collectionRecordController: CollectionRecordController

  private constructor(collectionRecordController: CollectionRecordController) {
    this.router = Router()
    this.collectionRecordController = collectionRecordController
    this.router.post("/new", this.createNewCollectionRecord)
    this.router.delete("/delete/:id", this.deleteCollectionRecordById)
    // this.router.get("/last", this.getLastCollectionRecord)
    this.router.get("/paginated", this.getPaginatedCollectionRecords)
    this.router.get("/info/:id", this.getCollectionRecordById)
    this.router.put("/update/:id", this.updateCollectionRecordById)
  }
  static getRouter(): Router {
    if (!ColecctionRecordRouter.instance) {
      const collectionRecordRepository = new CollectionRecordMongoRepository()
      const collectionRepository = new CollectionMongoRepository()
      const collectionRecordController = new CollectionRecordController(
        collectionRecordRepository,
        collectionRepository
      )
      ColecctionRecordRouter.instance = new ColecctionRecordRouter(collectionRecordController)
    }
    return ColecctionRecordRouter.instance.router
  }
  private createNewCollectionRecord = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const userId = req.user.sub
      const data = req.body

      const response = await this.collectionRecordController.createNewCollectionRecord(data, userId)
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
  // private getCropsByUser = async (req: Request, res: Response) => {
  //   try {
  //     if (!req.user) {
  //       return res.status(403).send({
  //         message: "unauthorized",
  //       })
  //     }
  //     const userId = req.user.sub

  //     const response = await this.cropController.getCropsByUser(userId)
  //     if (response.status === "error") {
  //       return res.status(response.code).send({
  //         status: "error",
  //         message: response.message,
  //       })
  //     }
  //     return res.status(response.code).send({
  //       status: response.status,
  //       data: response.data,
  //       message: response.message,
  //     })
  //   } catch (error: any) {
  //     return res.status(500).send({
  //       status: "error",
  //       message: error.message,
  //     })
  //   }
  // }
  // private getCropById = async (req: Request, res: Response) => {
  //   try {
  //     if (!req.user) {
  //       return res.status(403).send({
  //         message: "unauthorized",
  //       })
  //     }
  //     const cropId = req.params.id

  //     const response = await this.cropController.getCropInfo(cropId)
  //     if (response.status === "error") {
  //       return res.status(response.code).send({
  //         status: "error",
  //         message: response.message,
  //       })
  //     }
  //     return res.status(response.code).send({
  //       status: response.status,
  //       data: response.data,
  //       message: response.message,
  //     })
  //   } catch (error: any) {
  //     return res.status(500).send({
  //       status: "error",
  //       message: error.message,
  //     })
  //   }
  // }
  // private getCropsPaginated = async (req: Request, res: Response) => {
  //   try {
  //     if (!req.user) {
  //       return res.status(403).send({
  //         message: "unauthorized",
  //       })
  //     }
  //     const userId = req.user.sub
  //     const page = parseInt(req.query.page as string)
  //     const limit = parseInt(req.query.limit as string)
  //     const lotId = req.query.lot_id as string
  //     const response = await this.cropController.getCropsPaginated(page, limit, userId, lotId)
  //     if (response.status === "error") {
  //       return res.status(response.code).send({
  //         status: "error",
  //         message: response.message,
  //       })
  //     }
  //     return res.status(response.code).send({
  //       status: response.status,
  //       data: response.data,
  //       message: response.message,
  //     })
  //   } catch (error: any) {
  //     return res.status(500).send({
  //       status: "error",
  //       message: error.message,
  //     })
  //   }
  // }
  // private deleteCropById = async (req: Request, res: Response) => {
  //   try {
  //     if (!req.user) {
  //       return res.status(403).send({
  //         message: "unauthorized",
  //       })
  //     }
  //     const cropId = req.params.id
  //     const data = req.body
  //     const response = await this.cropController.deleteCrop(data, cropId)
  //     if (response.status === "error") {
  //       return res.status(response.code).send({
  //         status: "error",
  //         message: response.message,
  //       })
  //     }
  //     return res.status(response.code).send({
  //       status: response.status,
  //       data: response.data,
  //       message: response.message,
  //     })
  //   } catch (error: any) {
  //     return res.status(500).send({
  //       status: "error",
  //       message: error.message,
  //     })
  //   }
  // }
  // private updateCropById = async (req: Request, res: Response) => {
  //   try {
  //     if (!req.user) {
  //       return res.status(403).send({
  //         message: "unauthorized",
  //       })
  //     }
  //     const cropId = req.params.id
  //     const data = req.body
  //     const response = await this.cropController.updateCropInfo(cropId, data)
  //     if (response.status === "error") {
  //       return res.status(response.code).send({
  //         status: "error",
  //         message: response.message,
  //       })
  //     }
  //     return res.status(response.code).send({
  //       status: response.status,
  //       data: response.data,
  //       message: response.message,
  //     })
  //   } catch (error: any) {
  //     return res.status(500).send({
  //       status: "error",
  //       message: error.message,
  //     })
  //   }
  // }
  private deleteCollectionRecordById = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const collectionRecordId = req.params.id
      const response = await this.collectionRecordController.deleteCollectionRecordById(
        collectionRecordId
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
  public getPaginatedCollectionRecords = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const userId = req.user.sub
      const page = parseInt(req.query.page as string)
      const limit = parseInt(req.query.limit as string)
      const collectionId = req.query.collection_id as string
      const response = await this.collectionRecordController.getPaginatedCollectionRecords(
        page,
        limit,
        userId,
        collectionId
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
  private getCollectionRecordById = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const collectionRecordId = req.params.id
      if (!collectionRecordId) {
        return res.status(400).send({
          status: "error",
          message: "Collection record id is required",
        })
      }
      const response = await this.collectionRecordController.getCollectionRecordById(
        collectionRecordId
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
  private updateCollectionRecordById = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(403).send({
          message: "unauthorized",
        })
      }
      const collectionRecordId = req.params.id
      const data = req.body
      const response = await this.collectionRecordController.updateCollectionRecordById(
        collectionRecordId,
        data
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
