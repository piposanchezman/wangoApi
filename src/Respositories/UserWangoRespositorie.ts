import { UserWango } from "../models/UserWango"
import UserWangoModel from "../models/UserWango"
export interface UserRespositorie {
  getUserInfo: (userId: string) => Promise<UserWango | null>
  updateUserInfo: (userId: string, data: UserWango) => Promise<any>
  migrateUser: (userId: string, email: string, picture: string) => Promise<any>
}
export class UserWangoMongoRespositorie implements UserRespositorie {
  public async getUserInfo(userId: string): Promise<UserWango | null> {
    return await UserWangoModel.findOne({ user: userId })
  }
  public async updateUserInfo(userId: string, data: UserWango) {
    return await UserWangoModel.findOneAndUpdate(
      {
        user: userId,
      },
      data,
      {
        new: true,
      }
    ).exec()
  }
  public async migrateUser(userId: string, email: string, picture: string) {
    const newUser = new UserWangoModel({
      user: userId,
      email: email,
      picture: picture,
    })
    return await newUser.save()
  }
}
