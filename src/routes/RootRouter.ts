import { Request, Response, Router } from "express"
import { UserRouter } from "../routes/UserRouter"
import { LotRouter } from "./LotRouter"
import { ColecctionRecordRouter } from "./CollectionRecordRouter"
import { CollectionCropRouter } from "./CollectionCropRouter"
import { CropRouter } from "./CropRouter"
import { WaterFootprintRouter } from "./WaterFootprintRouter"
import { MiddlewareController } from "../middleware/Authentication"
export class RootRouter {
  private static instance: RootRouter
  private router: Router
  private constructor() {
    this.router = Router()
    this.router.get("/", (req: Request, res: Response) => {
      res.send("Hello World 1")
    })
    this.router.use(MiddlewareController.verifyToken)
    this.router.use("/v1/user", UserRouter.getRouter())
    this.router.use("/v1/lot", LotRouter.getRouter())
    this.router.use("/v1/crop", CropRouter.getRouter())
    this.router.use("/v1/collection", CollectionCropRouter.getRouter())
    this.router.use("/v1/collection-record", ColecctionRecordRouter.getRouter())
    this.router.use("/v1/water-footprint", WaterFootprintRouter.getRouter())
  }
  static getRouter(): Router {
    if (!RootRouter.instance) {
      RootRouter.instance = new RootRouter()
    }
    return RootRouter.instance.router
  }
}
