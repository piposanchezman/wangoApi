import { Document, Schema, model } from "mongoose"
enum Stage {
  fruiting = 1.75,
}
export interface CollectionRecord extends Document {
  _id: string
  amount_chemicals_used: number
  actual_crop_evapotranspiration: number
  collection_id: any
  current_stage: Stage
  daily_performance: number
  name: string
  reference_evotranspiration: number
  user: string
  createdAt: Date
  updatedAt: Date
}
const CollectionRecordSchema = new Schema<CollectionRecord>(
  {
    amount_chemicals_used: {
      type: Number,
      required: true,
    },
    actual_crop_evapotranspiration: {
      type: Number,
      required: true,
    },
    collection_id: {
      type: Schema.Types.ObjectId,
      ref: "Collections",
      required: true,
    },
    current_stage: {
      type: Number,
      required: true,
      default: 1.75,
    },
    daily_performance: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    reference_evotranspiration: {
      type: Number,
      required: true,
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

export const CollectionRecordModel = model<CollectionRecord>(
  "collection_records",
  CollectionRecordSchema
)
