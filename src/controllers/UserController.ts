import { UserRespositorie } from "../Respositories/UserWangoRespositorie"
import { UtilsController } from "./UtilsController"
import { Encryption } from "../middleware/Encryption"
import { UserWango } from "../models/UserWango"
import { ErrorHandling } from "../middleware/ErrorHandling"
import { ApiResponse } from "../interfaces/Api"
import { Auth0User } from "../interfaces/Auth0"
export class UserController {
  private userWangoRepositorie: UserRespositorie

  constructor(userWangoRepositorie: UserRespositorie) {
    this.userWangoRepositorie = userWangoRepositorie
  }
  public migrateUser = async (userId: string): Promise<ApiResponse> => {
    try {
      const response = await UtilsController.getAuthUser(userId)
      const auth0User: Auth0User = response.data
      const newUser = this.userWangoRepositorie.migrateUser(
        userId,
        auth0User.email,
        auth0User.picture
      )
      return {
        code: 200,
        status: "success",
        message: "user migrated successfully",
        data: newUser,
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public getUserInfo = async (userId: string): Promise<ApiResponse> => {
    try {
      const user = await this.userWangoRepositorie.getUserInfo(userId)
      if (!user) {
        return {
          code: 404,
          status: "error",
          data: null,
          message: "user not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: user,
        message: "user found",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
  public updateUserInfo = async (userId: string, data: UserWango): Promise<ApiResponse> => {
    try {
      if (data.security.password) {
        data.security.password = await Encryption.hashPassword(data.security.password)
      }
      const user = await this.userWangoRepositorie.updateUserInfo(userId, data)
      if (!user) {
        return {
          code: 404,
          status: "error",
          message: "user not found",
        }
      }
      return {
        code: 200,
        status: "success",
        data: user,
        message: "user updated",
      }
    } catch (error: any) {
      return ErrorHandling.handleError(error)
    }
  }
}
