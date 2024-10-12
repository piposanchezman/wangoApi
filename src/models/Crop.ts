import { model, Schema } from "mongoose"
import { Document } from "mongoose"
export interface Crop extends Document {
  _id: string
  area: number
  latitude: number
  longitude: number
  lot_id: any
  name: string
  status_data_collection: string
  user: string
}
const CropSchema = new Schema<Crop>(
  {
    area: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    lot_id: {
      type: Schema.Types.ObjectId,
      ref: "Lots",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    status_data_collection: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)
const CropModel = model<Crop>("Crops", CropSchema)
export default CropModel
