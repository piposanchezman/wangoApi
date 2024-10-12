import mongoose from "mongoose"
export class Database {
  private static instance: Database
  constructor() {
    this.connect()
  }
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
  async connect() {
    try {
      if (process.env.MONGO_URI && process.env.MONGO_URI !== "") {
        const connection = await mongoose.connect(process.env.MONGO_URI as string)
        const url = `${connection.connection.host}:${connection.connection.db.namespace}:${connection.connection.port}`
        console.log(`Mongo DB connected ${url}`)
      }
    } catch (error: any) {
      console.log(`error: ${error.message}`)
      process.exit(1)
    }
  }
  async disconnect() {
    await mongoose.connection.close()
    console.log("Mongo DB disconnected")
  }
}
