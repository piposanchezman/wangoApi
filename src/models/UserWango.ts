import { model, Schema, Document } from "mongoose"

interface EnvironmentVariables {
  fraction: number
  maximum_quantity: number
  natural_amount_chemical: number
}
export interface UserWango extends Document {
  user: string
  id_type: string
  id_number: string
  name: string
  last_name: string
  email: string
  environment_variables: EnvironmentVariables
  picture: string
  roles: string[]
  security: {
    identity_verified: boolean
    password: string
  }
}
const environmentVariablesDefault: EnvironmentVariables = {
  fraction: 0,
  maximum_quantity: 50,
  natural_amount_chemical: 0.5,
}
const userWangoSchema = new Schema<UserWango>(
  {
    user: {
      type: String,
      required: true,
    },
    id_type: {
      type: String,
      default: "",
      trim: false,
    },
    id_number: {
      type: String,
      default: "",
      trim: false,
    },
    name: {
      type: String,
      default: "",
      trim: false,
    },
    last_name: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    picture: {
      type: String,
    },
    environment_variables: {
      type: {
        fraction: {
          type: Number,
          default: environmentVariablesDefault.fraction,
        },
        maximum_quantity: {
          type: Number,
          default: environmentVariablesDefault.maximum_quantity,
        },
        natural_amount_chemical: {
          type: Number,
          default: environmentVariablesDefault.natural_amount_chemical,
        },
      },
      default: environmentVariablesDefault,
    },

    roles: {
      type: [String],
      default: ["admin"],
    },
    security: {
      identity_verified: {
        type: Boolean,
        default: false,
      },
      password: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

const UserWangoModel = model("User", userWangoSchema)
export default UserWangoModel
