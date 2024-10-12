// Interfaces
import { CollectionRepository } from "../Respositories/CollectionRepositorie"
import { CollectionRecordRepository } from "../Respositories/CollectionRecordRepositorie"
import { CropRepository } from "../Respositories/CropRepositorie"
import { LotRespositorie } from "../Respositories/LotRepositorie"
import { UserRespositorie } from "../Respositories/UserWangoRespositorie"
// Controllers
import { CollectionCropController } from "../controllers/CollectionCropController"
import { CollectionRecordController } from "../controllers/CollectionRecordController"
import { CropController } from "../controllers/CropController"
// Repositories
import { CollectionMongoRepository } from "../Respositories/CollectionRepositorie"
import { CollectionRecordMongoRepository } from "../Respositories/CollectionRecordRepositorie"
import { CropMongoRepository } from "../Respositories/CropRepositorie"
import { LotMongoRespositorie } from "../Respositories/LotRepositorie"
import { UserWangoMongoRespositorie } from "../Respositories/UserWangoRespositorie"
import { WaterFootprintMongoRepositorie } from "../Respositories/WaterFootprintRepositorie"
// 2. Config a container to manage dependencies
export class DependencyContainer {
  static collectionRepository: CollectionRepository = new CollectionMongoRepository()
  static collectionRecordRepository: CollectionRecordRepository =
    new CollectionRecordMongoRepository()
  static cropRepository: CropRepository = new CropMongoRepository()
  static lotRepository: LotRespositorie = new LotMongoRespositorie()
  static waterFootprintRepository = new WaterFootprintMongoRepositorie()
  static userRepository: UserRespositorie = new UserWangoMongoRespositorie()

  static collectionRecordController: CollectionRecordController = new CollectionRecordController(
    DependencyContainer.collectionRecordRepository,
    DependencyContainer.collectionRepository
  )

  static collectionCropController: CollectionCropController = new CollectionCropController(
    DependencyContainer.collectionRepository,
    DependencyContainer.cropRepository,
    DependencyContainer.collectionRecordController
  )

  static cropController: CropController = new CropController(
    DependencyContainer.cropRepository,
    DependencyContainer.lotRepository,
    DependencyContainer.collectionCropController
  )
}
