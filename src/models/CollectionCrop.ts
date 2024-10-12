import { Document, model, Schema } from "mongoose"

export interface CollectionCrop extends Document {
  _id: string
  crop_id: any
  final_date: Date
  name: string
  status: string
  user: string
}
const CollectionCropSchema = new Schema<CollectionCrop>(
  {
    crop_id: {
      type: Schema.Types.ObjectId,
      ref: "Crops",
      required: true,
    },
    final_date: {
      type: Date,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "in_progress",
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

export const CollectionCropModel = model<CollectionCrop>("Collections", CollectionCropSchema)
