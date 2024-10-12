import mongoose from "mongoose"
import { Document } from "mongoose"
export interface WaterFootprint extends Document {
  _id: string
  collection_id: any
  crop_id: any
  blue_component: number
  green_component: number
  grey_component: number
  ia_suggestion: string
  total: number
  user: string
}

const LotSchema = new mongoose.Schema<WaterFootprint>(
  {
    collection_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collections",
      required: true,
    },
    crop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crops",
      required: true,
    },
    blue_component: {
      type: Number,
      default: 0,
    },
    green_component: {
      type: Number,
      required: true,
      default: 0,
    },
    grey_component: {
      type: Number,
      required: true,
      default: 0,
    },
    ia_suggestion: {
      type: String,
      default: "",
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const WaterFootprintModel = mongoose.model<WaterFootprint>("Water_footprint", LotSchema)
export default WaterFootprintModel
