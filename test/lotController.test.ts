import dotenv from "dotenv"
import { Database } from "../config/db"
import { CollectionMongoRepository } from "../src/Respositories/CollectionRepositorie"
import { CollectionRecordMongoRepository } from "../src/Respositories/CollectionRecordRepositorie"
import { CropController } from "../src/controllers/CropController"
import { LotController } from "../src/controllers/LotController"
import { CropMongoRepository } from "../src/Respositories/CropRepositorie"
import { LotMongoRespositorie } from "../src/Respositories/LotRepositorie"
import { CollectionCropController } from "../src/controllers/CollectionCropController"
import { CollectionRecordController } from "../src/controllers/CollectionRecordController"

describe("Test LotController", () => {
  let db = new Database()
  const lotRepositorie = new LotMongoRespositorie()
  const collectionRepositorie = new CollectionMongoRepository()
  const collectionRecordRepositorie = new CollectionRecordMongoRepository()
  const cropRepositorie = new CropMongoRepository()
  const collectionRecordController = new CollectionRecordController(
    collectionRecordRepositorie,
    collectionRepositorie
  )
  const collectionController = new CollectionCropController(
    collectionRepositorie,
    cropRepositorie,
    collectionRecordController
  )
  const cropController = new CropController(cropRepositorie, lotRepositorie, collectionController)
  let lotController = new LotController(lotRepositorie, cropController)
  beforeAll(() => {
    dotenv.config({ path: ".env.test" })
    db = new Database()
  })
  afterAll(async () => {
    await db.disconnect()
  })
  it("should create a new lot", async () => {
    const userId = "google-oauth2|113615054709188443050"
    const lot = {
      available_capacity: 100,
      name: "Test Lot 1",
      capacity: 100,
      capacity_in_use: 0,
    }
    const response = await lotController.createNewLot(lot, userId)
    expect(response).toBeDefined()
    expect(response.data.name).toBe("Test Lot 1")
  })
  it("should get a lot by id", async () => {
    const userId = "google-oauth2|113615054709188443050"
    const lot = {
      available_capacity: 100,
      name: "Test Lot 2",
      capacity: 100,
      capacity_in_use: 0,
    }
    const response = await lotController.createNewLot(lot, userId)
    const lotId = response.data._id
    const responseLot = await lotController.getLotById(lotId)
    expect(responseLot).toBeDefined()
    expect(responseLot.data.name).toBe("Test Lot 2")
  })
})
