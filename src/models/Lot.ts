import mongoose from "mongoose"
import { Document } from "mongoose"
export interface Lot extends Document {
  available_capacity: number
  name: string
  capacity: number
  capacity_in_use: number
  user: string
}
const LotSchema = new mongoose.Schema<Lot>(
  {
    available_capacity: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    capacity_in_use: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: "String",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const LotModel = mongoose.model<Lot>("Lots", LotSchema)
export default LotModel
